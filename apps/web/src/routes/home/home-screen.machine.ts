import { ActorRefFrom, assign, createMachine, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';

const homeScreenModel = createModel(
  {
    inputErrorMessage: '' as string,
    playerName: '' as string,
  },
  {
    events: {
      INPUT_CHANGE_PLAYER_NAME: (value: string) => ({ playerName: value }),
      PRESS_CREATE: () => ({}),
    },
  }
);

export const HomeScreenEvents = homeScreenModel.events;

export const homeScreenMachine = homeScreenModel.createMachine(
  {
    id: 'homeScreenMachine',
    initial: 'WaitingForInput',
    states: {
      WaitingForInput: {
        on: {
          INPUT_CHANGE_PLAYER_NAME: {
            target: 'WaitingForInput',
            actions: ['assignPlayerName', 'clearError'],
          },
          PRESS_CREATE: [
            {
              target: 'Validating',
              cond: 'isPlayerNameValid',
            },
          ],
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
          return event.playerName;
        },
      }),
    },
    services: {
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
