import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const appModel = createModel(
  {
    userId: undefined as string | undefined,
  },
  {}
);

/**
 * Holds the high-level state for the app.
 *
 * By default, players join the lobby, unless a game_instance_id exists.
 */
export const appMachine = createMachine(
  {
    id: 'appMachine',
    initial: 'Init',
    context: appModel.initialContext,
    states: {
      Init: {
        invoke: {
          src: 'initialize',
        },
      },
      Lobby: {},
      Game: {},
    },
  },
  {
    services: {
      initialize: (context, event) => {
        console.log('inintialize');
        return Promise.resolve();
      },
    },
  }
);

export type AppContext = ContextFrom<typeof appModel>;
export type AppEvent = EventFrom<typeof appModel>;
export type AppActor = ActorRefFrom<typeof appMachine>;
export type AppState = StateFrom<typeof appMachine>;

export default appMachine;
