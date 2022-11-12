import { ActorRefFrom, assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { fetchUserProfileByName } from '~/web/api/fetchUserProfileByName';
import { AuthActor } from '~/web/state/auth.machine';
import { selectAuthIsInitalized } from '~/web/state/auth.selectors';
import { assertEventType } from '~/web/state/utils';
import { NewUserLandingFooter } from './new-user-landing-footer.component';

const homeScreenModel = createModel(
  {
    // todo refactor this to use form machine
    inputErrorMessage: undefined as string | undefined,
    playerName: '' as string,
    authActor: {} as AuthActor,
  },
  {
    events: {
      CHECK_AVAILABILITY: (value: string) => ({ playerName: value }),
      INPUT_CHANGE_PLAYER_NAME: (value: string) => ({ playerName: value }),
      PRESS_CREATE: () => ({}),
    },
  }
);

export const HomeScreenEvents = homeScreenModel.events;

export const createHomeScreenMachine = ({
  authActor,
}: {
  authActor: AuthActor;
}) => {
  return homeScreenModel.createMachine(
    {
      id: 'HomeScreenMachine',
      initial: 'Loading',
      context: {
        inputErrorMessage: undefined,
        playerName: '',
        authActor,
      },
      states: {
        Loading: {
          invoke: {
            src: 'getHasClub',
            onDone: [
              {
                target: 'WelcomeBack',
                cond: (_, event) => !!event.data,
              },
              { target: 'NewUserLanding' },
            ],
            onError: 'NewUserLanding',
          },
        },
        WelcomeBack: {},
        NewUserLanding: {
          type: 'parallel',
          meta: {
            footer: NewUserLandingFooter,
          },
          states: {
            Valid: {
              initial: 'No',
              states: {
                No: {
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: {
                      target: 'Yes',
                      cond: 'isPlayerNameValid',
                    },
                  },
                  // If we are NOT invalid
                },
                Yes: {
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: [
                      {
                        target: 'Yes',
                        cond: 'isPlayerNameValid',
                      },
                      {
                        target: 'No',
                      },
                    ],
                  },
                },
              },
            },
            Availability: {
              initial: 'Unitialized',
              states: {
                Unitialized: {
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: {
                      target: 'Fetching',
                      cond: 'isPlayerNameValid',
                    },
                  },
                },
                Fetching: {
                  entry: 'assignPlayerName',
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: [
                      {
                        target: 'Fetching',
                        cond: 'isPlayerNameValid',
                      },
                      {
                        target: 'Unitialized',
                      },
                    ],
                  },
                  invoke: {
                    src: 'getPlayerNameIsAvailable',
                    onDone: [
                      {
                        target: 'Available',
                        cond: (_, event) => !!event.data,
                      },
                      {
                        target: 'Unavailable',
                      },
                    ],
                  },
                },
                Unavailable: {
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: [
                      {
                        target: 'Fetching',
                        cond: 'isPlayerNameValid',
                      },
                      {
                        target: 'Unitialized',
                      },
                    ],
                  },
                },
                Available: {
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: [
                      {
                        target: 'Fetching',
                        cond: 'isPlayerNameValid',
                      },
                      {
                        target: 'Unitialized',
                      },
                    ],
                    PRESS_CREATE: '#HomeScreenMachine.Complete',
                  },
                },
              },
            },
          },
        },
        Complete: {
          type: 'final' as const,
          data: (context) => context.playerName,
        },
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        clearError: assign({
          inputErrorMessage: (_) => '',
        }),
        setValidationError: assign({
          inputErrorMessage: (_) => 'code must be 4 characters',
        }),
        assignPlayerName: assign({
          playerName: (_, event) => {
            if (event.type !== 'INPUT_CHANGE_PLAYER_NAME') {
              throw new Error(
                `unhandled event type in action assign party code ${event.type}`
              );
            }
            return event.playerName;
          },
        }),
      },
      guards: {
        isPlayerNameValid: (_, event) => {
          switch (event.type) {
            case 'INPUT_CHANGE_PLAYER_NAME':
              return event.playerName.length >= 3;
            default:
              throw new Error(
                `Non-existent actor type in switch: ${event.type}`
              );
          }
        },
      },
      services: {
        getHasClub: async ({ authActor }, event) => {
          const authState = await waitFor(authActor, selectAuthIsInitalized);
          return !!authState.context.profile?.player_name;
        },
        getPlayerNameIsAvailable: async (context, event) => {
          assertEventType(event, 'INPUT_CHANGE_PLAYER_NAME');

          try {
            const profile = await fetchUserProfileByName(event.playerName);
            return !profile;
          } catch (ex) {
            // TODO break down error by type
            return true;
          }
        },
      },
    }
  );
};

export type HomeScreenMachine = ReturnType<typeof createHomeScreenMachine>;
export type HomeScreenActor = ActorRefFrom<HomeScreenMachine>;
export type HomeScreenState = StateFrom<HomeScreenMachine>;
