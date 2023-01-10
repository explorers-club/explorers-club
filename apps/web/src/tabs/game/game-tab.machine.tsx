import {
  createRoomStore,
  GameId,
  GameStore,
  TriviaJamStore,
} from '@explorers-club/room';
import {
  DiffusionaryRoomIdSchema,
  GameRoomId,
  LittleVigilanteRoomIdSchema,
  TriviaJamRoomIdSchema,
} from '@explorers-club/schema';
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
  gameId?: GameId;
  store?: GameStore;
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
                src: async ({ roomId }) => {
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
          gameId: (_, { roomId }) => {
            if (TriviaJamRoomIdSchema.safeParse(roomId).success) {
              return 'trivia_jam';
            } else if (DiffusionaryRoomIdSchema.safeParse(roomId).success) {
              return 'diffusionary';
            } else if (LittleVigilanteRoomIdSchema.safeParse(roomId).success) {
              return 'little_vigilante';
            } else {
              throw new Error("couldn't parse gameId from roomId " + roomId);
            }
          },
        }),
      },
    }
  );

export type GameTabMachine = ReturnType<typeof createGameTabMachine>;
export type GameTabActor = ActorRefFrom<GameTabMachine>;
export type GameTabState = StateFrom<GameTabMachine>;
