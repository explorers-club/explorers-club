import { createRoomStore, GameId, TriviaJamStore } from '@explorers-club/room';
import { GameRoomId } from '@explorers-club/schema';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { TabMetadata } from '@organisms/tab-bar';
import { RocketIcon } from '@radix-ui/react-icons';
import { Client } from 'colyseus.js';
import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';

export type GameTabContext = {
  roomId: GameRoomId;
  type?: GameId;
  store?: TriviaJamStore;
};

type GameTabEvent = { type: 'CONNECT'; roomId: GameRoomId };

export const createGameTabMachine = (colyseusClient: Client, userId: string) =>
  createMachine(
    {
      id: 'GameTabMachine',
      type: 'parallel',
      schema: {
        context: {} as GameTabContext,
        events: {} as GameTabEvent,
      },
      states: {
        Room: {
          initial: 'Uninitialized',
          states: {
            Uninitialized: {
              on: {
                CONNECT: {
                  target: 'Connecting',
                  actions: ['setRoomId'],
                },
              },
              always: {
                target: 'Connecting',
                cond: ({ roomId }) => !!roomId,
              },
            },
            Connecting: {
              invoke: {
                src: async (_, { roomId }) => {
                  const room = await colyseusClient.joinById<TriviaJamState>(
                    roomId,
                    {
                      userId,
                    }
                  );
                  await new Promise((resolve) =>
                    room.onStateChange.once(resolve)
                  );

                  return createRoomStore(room);
                },
                onDone: {
                  target: 'Connected',
                  actions: assign<
                    GameTabContext,
                    DoneInvokeEvent<TriviaJamStore>
                  >({
                    store: (_, { data }) => data,
                  }),
                },
                onError: 'Error',
              },
            },
            Connected: {},
            Error: {},
          },
        },
        Tab: {
          meta: {
            displayName: 'Game',
            icon: <RocketIcon />,
          } as TabMetadata,
          initial: 'Unitialized',
          states: {
            Unitialized: {
              always: [
                {
                  target: 'Visible',
                  cond: ({ roomId }) => !!roomId,
                },
                {
                  target: 'Hidden',
                },
              ],
            },
            Hidden: {
              on: {
                CONNECT: 'Visible',
              },
            },
            Visible: {},
          },
        },
      },
    },
    {
      actions: {
        setRoomId: assign<GameTabContext, GameTabEvent>({
          roomId: (_, { roomId }) => roomId,
          type: (_, { roomId }) => 'trivia_jam', // todo parse id to get
        }),
      },
    }
  );

export type GameTabMachine = ReturnType<typeof createGameTabMachine>;
export type GameTabActor = ActorRefFrom<GameTabMachine>;
export type GameTabState = StateFrom<GameTabMachine>;