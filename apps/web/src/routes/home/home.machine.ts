import { assign } from 'xstate';
import { createModel } from 'xstate/lib/model';

export const homeModel = createModel(
  {
    partyCode: '' as string,
  },
  {
    events: {
      INPUT_CHANGE_PARTY_CODE: (value: string) => ({ partyCode: value }),
      PRESS_JOIN_PARTY: () => ({}),
      PRESS_START_PARTY: () => ({}),
    },
  }
);

export const homeMachine = homeModel.createMachine(
  {
    id: 'homeMachine',
    initial: 'WaitingForInput',
    states: {
      WaitingForInput: {
        on: {
          INPUT_CHANGE_PARTY_CODE: {
            target: 'WaitingForInput',
            actions: assign({
              partyCode: (_, event) => event.partyCode,
            }),
          },
          PRESS_JOIN_PARTY: {
            target: 'Connecting',
            cond: 'isJoinCodeValid',
          },
        },
      },
      Connecting: {
        invoke: {
          src: 'connectToParty',
          onDone: 'Complete',
          onError: 'Error',
        },
      },
      Error: {
        on: {
          INPUT_CHANGE_PARTY_CODE: {
            target: 'WaitingForInput',
            actions: assign({
              partyCode: (_, event) => event.partyCode,
            }),
          },
        },
      },
      Complete: {
        type: 'final' as const,
      },
    },
    predictableActionArguments: true,
  },
  {
    guards: {
      isJoinCodeValid: (context) => context.partyCode.length === 4,
    },
    services: {
      connectToParty: async (context, event) => {
        return 'cool!';
      },
    },
  }
);
