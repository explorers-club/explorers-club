import { CreateMachineFunction } from '@explorers-club/actor';
import { Database, get, ref } from 'firebase/database';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';

const LobbyPlayerModel = createModel(
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

export type LobbyPlayerContext = ModelContextFrom<typeof LobbyPlayerModel>;
export type LobbyPlayerEvent = ModelEventsFrom<typeof LobbyPlayerModel>;

// type LobbyServerTypeState = Typestate<LobbyPlayerContext>;

export const createLobbyPlayerMachine: CreateMachineFunction = () =>
  createMachine<LobbyPlayerContext, LobbyPlayerEvent>(
    {
      id: 'LobbyPlayerMachine',
      type: 'parallel',
      states: {
        Ready: {
          initial: 'No',
          states: {
            Yes: {},
            No: {},
          },
        },
        Connected: {
          initial: 'Yes',
          states: {
            Yes: {},
            No: {},
          },
        },
      },
    },
    {
      guards: {},
      services: {},
    }
  );

export type LobbyPlayerMachine = ReturnType<typeof createLobbyPlayerMachine>;
export type LobbyPlayerActor = ActorRefFrom<LobbyPlayerMachine>;
export type LobbyPlayerState = StateFrom<LobbyPlayerMachine>;
