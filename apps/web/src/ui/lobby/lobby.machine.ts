import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const lobbyModel = createModel({}, {});

export const lobbyMachine = createMachine(
  {
    id: 'lobbyMachine',
    initial: 'Idle',
    context: lobbyModel.initialContext,
    states: {
      Idle: {},
      Loading: {},
    },
  },
  {
    services: {},
  }
);

export type LobbyContext = ContextFrom<typeof lobbyModel>;
export type LobbyEvent = EventFrom<typeof lobbyModel>;
export type LobbyActor = ActorRefFrom<typeof lobbyMachine>;
export type LobbyState = StateFrom<typeof lobbyMachine>;

export default lobbyMachine;
