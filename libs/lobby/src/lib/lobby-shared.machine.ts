import { CreateMachineFunction } from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';

const LobbySharedModel = createModel(
  {
    playerActorIds: [],
  },
  {
    events: {
      PLAYER_JOINED: () => ({}),
      PLAYER_LEFT: () => ({}),
      ALL_PLAYERS_READY: () => ({}),
      START_GAME: () => ({}),
      PLAYER_NOT_READY: () => ({}),
      GAME_CREATED: () => ({}),
    },
  }
);

export type LobbySharedContext = ModelContextFrom<typeof LobbySharedModel>;
export type LobbySharedEvent = ModelEventsFrom<typeof LobbySharedModel>;

export const LobbySharedEvents = LobbySharedModel.events;

export const createLobbySharedMachine: CreateMachineFunction = () => {
  return createMachine<LobbySharedContext, LobbySharedEvent>({
    id: 'LobbySharedMachine',
    initial: 'Waiting',
    states: {
      Waiting: {
        on: {
          ALL_PLAYERS_READY: 'AllReady',
        },
      },
      AllReady: {
        on: {
          PLAYER_NOT_READY: 'Waiting',
          START_GAME: "CreatingGame"
        },
      },
      CreatingGame: {
        on: {
          GAME_CREATED: 'EnteringGame',
        },
      },
      EnteringGame: {
        type: 'final' as const,
      },
    },
    predictableActionArguments: true,
  });
};

export type LobbySharedMachine = ReturnType<typeof createLobbySharedMachine>;
export type LobbySharedActor = ActorRefFrom<LobbySharedMachine>;
export type LobbySharedState = StateFrom<LobbySharedMachine>;
