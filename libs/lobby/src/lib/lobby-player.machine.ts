import { CreateMachineFunction } from '@explorers-club/actor';
import { ActorRefFrom, assign, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';

const LobbyPlayerModel = createModel(
  {
    playerName: undefined as string | undefined,
  },
  {
    events: {
      PLAYER_SET_NAME: (playerName: string) => ({ playerName }),
      PLAYER_UNREADY: () => ({}),
      PLAYER_READY: () => ({}),
      PLAYER_REJOIN: () => ({}),
      PLAYER_DISCONNECT: () => ({}),
    },
  }
);

export const LobbyPlayerEvents = LobbyPlayerModel.events;

export type LobbyPlayerContext = ModelContextFrom<typeof LobbyPlayerModel>;
export type LobbyPlayerEvent = ModelEventsFrom<typeof LobbyPlayerModel>;

// type LobbyServerTypeState = Typestate<LobbyPlayerContext>;

export const createLobbyPlayerMachine: CreateMachineFunction = () =>
  createMachine<LobbyPlayerContext, LobbyPlayerEvent>(
    {
      id: 'LobbyPlayerMachine',
      type: 'parallel',
      context: {
        playerName: undefined,
      },
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
          on: {
            PLAYER_SET_NAME: {
              actions: 'assignPlayerName',
            },
          },
          states: {
            No: {
              on: {
                PLAYER_REJOIN: 'Yes',
              },
            },
            Yes: {
              on: {
                PLAYER_DISCONNECT: 'No',
              },
            },
          },
        },
      },
    },
    {
      actions: {
        assignPlayerName: assign({
          playerName: (context, event) => {
            if (event.type === 'PLAYER_SET_NAME') {
              return event.playerName;
            } else {
              return context.playerName;
            }
          },
        }),
      },
    }
  );

export type LobbyPlayerMachine = ReturnType<typeof createLobbyPlayerMachine>;
export type LobbyPlayerActor = ActorRefFrom<LobbyPlayerMachine>;
export type LobbyPlayerState = StateFrom<LobbyPlayerMachine>;
