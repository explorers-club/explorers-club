import { CreateMachineFunction } from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';

const LobbyServerModel = createModel(
  {
    userId: '' as string,
    playerName: undefined as string | undefined,
  },
  {
    events: {
      READY: () => ({}),
      SET_NAME: (name: string) => ({ name }),
      UNREADY: () => ({}),
    },
  }
);

export type LobbyServerContext = ModelContextFrom<typeof LobbyServerModel>;
export type LobbyServerEvent = ModelEventsFrom<typeof LobbyServerModel>;

export const createLobbyServerMachine: CreateMachineFunction = () => {
  return createMachine<LobbyServerContext, LobbyServerEvent>(
    {
      id: 'LobbyServerMachine',
      initial: 'Waiting',
      states: {
        Waiting: {},
        AllReady: {},
        StartingGame: {},
        Started: {
          type: 'final' as const,
        },
      },
      predictableActionArguments: true,
    },
    {}
  );
};

export type LobbyServerMachine = ReturnType<typeof createLobbyServerMachine>;
export type LobbyServerActor = ActorRefFrom<LobbyServerMachine>;
export type LobbyServerState = StateFrom<LobbyServerMachine>;
