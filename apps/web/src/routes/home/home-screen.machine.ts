import {
  ActorRefFrom,
  assign
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../../lib/supabase';
import { assertEventType } from '../../state/utils';

const homeScreenModel = createModel(
  {
    inputErrorMessage: undefined as string | undefined,
    playerName: '' as string,
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

export const homeScreenMachine = homeScreenModel.createMachine(
  {
    id: 'homeScreenMachine',
    initial: 'NameInput',
    states: {
      NameInput: {
        type: 'parallel',
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
                },
              },
            },
          },
        },
      },
      Validating: {},
      Creating: {},
      NetworkError: {},
      Complete: {
        type: 'final' as const,
        data: (context) => context.playerName, // Empty if starting a new one
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
          console.log('assinging', event.playerName);
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
            throw new Error(`Non-existent actor type in switch: ${event.type}`);
        }
      },
    },
    services: {
      getPlayerNameIsAvailable: async (context, event) => {
        assertEventType(event, 'INPUT_CHANGE_PLAYER_NAME');

        // TODO query supabase
        // context.playerName;
        const { data, error } = await supabaseClient
          .from('profiles')
          .select()
          .match({ player_name: event.playerName })
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          return false;
        }

        return true;
      },
      // joinParty: async (context, event) => {
      //   const party = await supabaseClient
      //     .from('parties')
      //     .select('*')
      //     .match({ code: context.partyCode })
      //     .single();
      //   return party;
      // },
    },
  }
);

export type HomeScreenActor = ActorRefFrom<typeof homeScreenMachine>;
