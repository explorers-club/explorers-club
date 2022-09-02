import { assign } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AuthActor } from '../../state/auth.machine';

export const playerSetupModel = createModel(
  {
    playerName: '' as string,
    authActor: {} as AuthActor,
  },
  {
    events: {
      INPUT_CHANGE_PLAYER_NAME: (value: string) => ({ playerName: value }),
      PRESS_SUBMIT: () => ({}),
    },
  }
);

export const playerSetupMachine = playerSetupModel.createMachine(
  {
    id: 'playerSetupMachine',
    states: {
      WaitingForInput: {
        on: {
          INPUT_CHANGE_PLAYER_NAME: {
            target: 'WaitingForInput',
            actions: assign({
              playerName: (_, event) => event.playerName,
            }),
          },
          PRESS_SUBMIT: [
            {
              target: 'Connecting',
              cond: 'isNameValid',
            },
            {
              target: 'Error',
            },
          ],
        },
      },
      Connecting: {
        invoke: {
          src: 'createUserAndSetName',
          onDone: 'Complete',
          onError: 'Error',
        },
      },
      Error: {
        on: {
          INPUT_CHANGE_PLAYER_NAME: {
            target: 'WaitingForInput',
            actions: assign({
              playerName: (_, event) => event.playerName,
            }),
          },
        },
      },
      Complete: {
        type: 'final' as const,
      },
    },
  },
  {
    guards: {
      // TODO alphanumberic, other validations
      isNameValid: (context) => context.playerName.length >= 2,
    },
    services: {
      createUserAndSetName: async (context, event) => {
        return 'cool!';
      },
    },
  }
);
