import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';
import { supabaseClient } from '../../lib/supabase';
import { AuthActor } from '../../state/auth.machine';
import { selectAuthIsInitalized } from '../../state/auth.selectors';
import { createAnonymousUser } from '../../state/auth.utils';
import { enterEmailMachine } from './enter-email.machine';
import { enterPasswordMachine } from './enter-password.machine';

const clubScreenModel = createModel(
  {
    hostPlayerName: '' as string,
    authActor: {} as AuthActor,
    email: undefined as string | undefined,
    // hostProfile: undefined as ProfilesRow | undefined,
    //     playerName: undefined as string | undefined,
    //     actorManager: {} as ActorManager,
    //     partyActor: undefined as PartyActor | undefined,
    //     myActor: undefined as PartyPlayerActor | undefined,
  },
  {
    events: {
      PRESS_CLAIM: () => ({}),
    },
  }
);

export const ClubScreenEvents = clubScreenModel.events;

interface CreateMachineProps {
  hostPlayerName: string;
  authActor: AuthActor;
}

export const createClubScreenMachine = ({
  hostPlayerName,
  authActor,
}: CreateMachineProps) => {
  // What network calls needs to happen?
  // Fetch to see if this profile has been claimed before
  // We can do that with useQuery and firebase I think
  return clubScreenModel.createMachine(
    {
      id: 'ClubScreenMachine',
      initial: 'Loading',
      context: {
        authActor,
        hostPlayerName,
        email: undefined,
      },
      states: {
        Loading: {
          invoke: {
            src: () => fetchUserProfileByName(hostPlayerName),
            onDone: 'Connecting', // todo persist data here?
            onError: 'Unclaimed',
          },
        },
        Unclaimed: {
          initial: 'Indeterminate',
          onDone: 'Connecting',
          states: {
            Indeterminate: {
              invoke: {
                src: 'getHasProfileName',
                onDone: [
                  {
                    target: 'NotExist',
                    cond: (_, event) => !!event.data,
                  },
                  {
                    target: 'Claimable',
                  },
                ],
              },
            },
            NotExist: {},
            Claimable: {
              on: {
                PRESS_CLAIM: 'Claiming',
              },
            },
            Claiming: {
              initial: 'Initializing',
              states: {
                Initializing: {
                  always: [
                    { target: 'CreateAccount', cond: 'isNotLoggedIn' },
                    { target: 'EnterEmail', cond: 'isAnonymous' },
                    { target: 'SavePlayerName' },
                  ],
                },
                CreateAccount: {
                  invoke: {
                    src: 'createAccount',
                    onDone: 'EnterEmail',
                    onError: 'Error',
                  },
                },
                EnterEmail: {
                  invoke: {
                    src: enterEmailMachine,
                    onDone: 'EnterPassword',
                    onError: 'Error',
                  },
                },
                EnterPassword: {
                  invoke: {
                    src: enterPasswordMachine,
                    onDone: 'SavePlayerName',
                    onError: 'Error',
                  },
                },
                SavePlayerName: {
                  invoke: {
                    src: 'savePlayerName',
                    onDone: 'Complete',
                    onError: 'Error',
                  },
                },
                Error: {},
                Complete: {
                  type: 'final' as const,
                },
              },
            },
            Claimed: {
              type: 'final' as const,
            },
          },
        },
        Connecting: {
          invoke: {
            src: 'connectToParty',
            onDone: 'Connected',
            onError: 'Error',
          },
        },
        Error: {},
        Connected: {},
      },
    },
    {
      guards: {
        isNotLoggedIn: ({ authActor }) => {
          const session = authActor.getSnapshot()?.context.session;
          return !session;
        },
        isClaimable: ({ authActor }) => {
          return false;
        },
        isAnonymous: ({ authActor }) => {
          return !!authActor
            .getSnapshot()
            ?.context.session?.user.email?.match('@anon-users.explorers.club');
        },
        // isPhoneNumberValid: (_, event) => {
        //   assertEventType(event, 'INPUT_CHANGE_PHONE_NUMBER');
        //   return event.email.length === 10 && !!event.email.match(/^[0-9]+$/);
        // },
      },
      services: {
        createAccount: ({ authActor }) => createAnonymousUser(authActor),
        getHasProfileName: async ({ authActor }) => {
          // Wait for the auth actor to finish fetching
          const authState = await waitFor(authActor, selectAuthIsInitalized);
          return !!authState.context.profile?.player_name;
        },
        savePlayerName: async (context) => {
          const userId = authActor.getSnapshot()?.context.session?.user.id;
          if (!userId) {
            throw new Error(
              'tried to save player name without being logged in'
            );
          }

          const playerName = context.hostPlayerName;

          const { error } = await supabaseClient
            .from('profiles')
            .update({ player_name: playerName })
            .eq('user_id', userId);

          if (error) {
            throw error;
          }

          return true;
        },
      },
    }
  );
};

export type ClubScreenMachine = ReturnType<typeof createClubScreenMachine>;
export type ClubScreenActor = ActorRefFrom<ClubScreenMachine>;
export type ClubScreenState = StateFrom<ClubScreenMachine>;
