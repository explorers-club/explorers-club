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
    initial: 'Lobby',
    context: appModel.initialContext,
    states: {
      Lobby: {},
      Game: {},
    },
  },
  {}
);

export type AppContext = ContextFrom<typeof appModel>;
export type AppEvent = EventFrom<typeof appModel>;
export type AppActor = ActorRefFrom<typeof appMachine>;
export type AppState = StateFrom<typeof appMachine>;

export default appMachine;
