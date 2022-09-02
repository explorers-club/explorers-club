import { createModel } from 'xstate/lib/model';
import { ContextFrom, EventFrom } from 'xstate/lib/types';

const profileModel = createModel(
  {
    userId: '' as string,
  },
  {
    events: {
      SET_PLAYER_NAME: (name: string) => ({ name }),
    },
  }
);

export type ProfileContext = ContextFrom<typeof profileModel>;
export type ProfileEvent = EventFrom<typeof profileModel>;

const profileMachine = profileModel.createMachine(
  {
    id: 'profileMachine',
    initial: 'Initializing',
    context: profileModel.initialContext,
    states: {
      Initializing: {
        invoke: {
          src: 'initialize',
          onDone: 'Idle',
        },
      },
      Idle: {},
    },
    predictableActionArguments: true,
  },

  {
    guards: {},
    services: {
      initialize: async (context) => {
        return 'cool';
      },
    },
  }
);
