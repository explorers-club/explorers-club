import {
  createRoomStore,
  GameId,
  GameServerEvent,
  GameStore,
  TriviaJamStore,
} from '@explorers-club/room';
import {
  DiffusionaryRoomIdSchema,
  GameRoomId,
  LittleVigilanteRoomIdSchema,
  TriviaJamRoomIdSchema,
} from '@explorers-club/schema';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { assertEventType } from '@explorers-club/utils';
import { TabMetadata } from '@organisms/tab-bar';
import { RocketIcon } from '@radix-ui/react-icons';
import { Client } from 'colyseus.js';
import { Observable } from 'rxjs';
import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';

export type GameTabContext = {
  event$?: Observable<GameServerEvent>;
  roomId?: GameRoomId;
  gameId?: GameId;
  store?: GameStore;
};

type GameTabEvent = { type: 'CONNECT'; roomId: GameRoomId } | { type: 'LEAVE' };

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
                  // Todo make this generic type
                  const room =
                    await colyseusClient.joinById<LittleVigilanteState>(
                      roomId!,
                      {
                        userId,
                      }
                    );
                  await new Promise((resolve) =>
                    room.onStateChange.once(resolve)
                  );

                  const event$ = new Observable<GameServerEvent>(function (
                    observer
                  ) {
                    // todo cleanup/remove this listener
                    room.onMessage('*', (_, message) => {
                      // console.log('GSE', message);
                      observer.next(message);
                    });
                  });

                  return [createRoomStore(room), event$];
                },
                onDone: {
                  target: 'Connected',
                  actions: assign<
                    GameTabContext,
                    DoneInvokeEvent<
                      [TriviaJamStore, Observable<GameServerEvent>]
                    >
                  >({
                    store: (_, { data }) => data[0],
                    event$: (_, { data }) => data[1],
                  }),
                },
                onError: 'Error',
              },
            },
            Connected: {
              on: {
                LEAVE: {
                  target: 'Uninitialized',
                  actions: 'clearGame',
                },
              },
            },
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
            Visible: {
              on: {
                LEAVE: 'Hidden',
              },
            },
          },
        },
      },
    },
    {
      actions: {
        clearGame: assign<GameTabContext, GameTabEvent>({
          roomId: () => undefined,
          gameId: () => undefined,
        }),
        setRoomId: assign<GameTabContext, GameTabEvent>({
          roomId: (_, event) => {
            assertEventType(event, 'CONNECT');
            return event.roomId;
          },
          gameId: (_, event) => {
            assertEventType(event, 'CONNECT');
            const { roomId } = event;
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
