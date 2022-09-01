import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import authMachine from './auth.machine';
import partyMachine from './party.machine';

const appModel = createModel({}, {});

/**
 * Holds the high-level state for the app.
 *
 * By default, players join the lobby, unless a game_instance_id exists.
 */
export const appMachine = createMachine(
  {
    id: 'appMachine',
    initial: 'Initializing',
    invoke: [
      {
        id: 'authActor',
        src: authMachine,
      },
      { id: 'partyActor', src: partyMachine },
    ],
    context: appModel.initialContext,
    states: {
      Initializing: {},
      Loaded: {},
    },
  },
  {
    guards: {},
    services: {},
  }
);

export type AppContext = ContextFrom<typeof appModel>;
export type AppEvent = EventFrom<typeof appModel>;
export type AppActor = ActorRefFrom<typeof appMachine>;
export type AppState = StateFrom<typeof appMachine>;

export default appMachine;
