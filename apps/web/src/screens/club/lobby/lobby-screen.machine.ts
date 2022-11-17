import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const lobbyScreenModel = createModel(
  {},
  {
    events: {
      FOO: () => ({}),
    },
  }
);

export const LobbyScreenEvents = lobbyScreenModel.events;

export const createLobbyScreenMachine = () => {
  return lobbyScreenModel.createMachine({
    id: 'LobbyScreenMachine',
    context: {},
    states: {},
    predictableActionArguments: true,
  });
};

export type LobbyScreenMachine = ReturnType<
  typeof createLobbyScreenMachine
>;
export type LobbyScreenActor = ActorRefFrom<LobbyScreenMachine>;
export type LobbyScreenState = StateFrom<LobbyScreenMachine>;
