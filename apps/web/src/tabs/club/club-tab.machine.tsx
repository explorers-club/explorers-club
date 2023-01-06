import {
  ClubRoomCommand,
  createRoomStore,
  RoomStore,
} from '@explorers-club/room';
import { ClubRoomId, ClubRoomIdSchema } from '@explorers-club/schema';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { assertEventType } from '@explorers-club/utils';
import { NotificationsActor } from '@organisms/notifications';
import { TabMetadata } from '@organisms/tab-bar';
import { HomeIcon } from '@radix-ui/react-icons';
import { Client, Room } from 'colyseus.js';
import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';

type ClubRoomStore = RoomStore<ClubState, ClubRoomCommand>;

export interface ClubTabContext {
  store?: ClubRoomStore;
  clubName?: string;
  room?: Room<ClubState>;
}

type ClubTabEvent =
  | { type: 'CONNECT'; clubName: string }
  | { type: 'CONFIGURE' }
  | { type: 'ENTER_NAME'; playerName: string }
  | { type: 'RECONNECT' }
  | { type: 'RETRY' }
  | { type: 'START_GAME' };

export const createClubTabMachine = (
  colyseusClient: Client,
  userId: string, // todo pass in an actor here intead?
  notificationsActor: NotificationsActor,
  clubName?: string
) => {
  const clubRoomId: ClubRoomId = `club-${clubName}`;

  return createMachine(
    {
      id: 'ClubTabMachine',
      type: 'parallel',
      schema: {
        context: {} as ClubTabContext,
        events: {} as ClubTabEvent,
      },
      context: {
        clubName,
      },
      states: {
        Room: {
          initial: 'Uninitialized',
          states: {
            Uninitialized: {
              on: {
                CONNECT: {
                  target: 'Connecting',
                  actions: ['setClubName', 'updateUrl'],
                },
              },
              always: {
                target: 'Connecting',
                cond: ({ clubName }) => !!clubName,
              },
            },
            Connecting: {
              invoke: {
                src: async ({ clubName }) => {
                  let room: Room<ClubState>;
                  const clubRooms = await colyseusClient.getAvailableRooms(
                    'club'
                  );
                  const clubRoomIds = clubRooms.map((room) =>
                    ClubRoomIdSchema.parse(room.roomId)
                  );

                  if (clubRoomIds.includes(clubRoomId)) {
                    const sessionId = localStorage.getItem(clubRoomId);

                    if (sessionId) {
                      try {
                        room = await colyseusClient.reconnect(
                          clubRoomId,
                          sessionId
                        );
                      } catch (ex) {
                        console.warn(
                          `error when trying to reconnect with ${sessionId} on ${clubRoomId}, joining normally`,
                          ex
                        );
                        // todo pass up auth tokens instead of user ids
                        room = await colyseusClient.joinById(clubRoomId, {
                          userId,
                        });
                      }
                    } else {
                      room = await colyseusClient.joinById(clubRoomId, {
                        userId,
                      });
                    }
                  } else {
                    room = await colyseusClient.create('club', {
                      roomId: clubRoomId,
                      userId,
                    });
                  }

                  room.onMessage(
                    'RESERVED_GAME_SEAT',
                    ({ room, sessionId }) => {
                      localStorage.setItem(room.roomId, sessionId);
                    }
                  );

                  localStorage.setItem(room.id, room.sessionId);
                  const store = createRoomStore(room);

                  // wait until the room has synced before returning
                  await new Promise((resolve) =>
                    room.onStateChange.once(resolve)
                  );

                  return [store, room];
                },
                onDone: {
                  target: 'Connected',
                  actions: assign<
                    ClubTabContext,
                    DoneInvokeEvent<[ClubRoomStore, Room<ClubState>]>
                  >({
                    store: (_, { data }) => data[0],
                    room: (_, { data }) => data[1],
                  }),
                },
                onError: 'Error',
              },
            },
            Connected: {
              initial: 'Uninitialized',
              invoke: {
                src: 'onDisconnect',
                onDone: 'Disconnected',
              },
              states: {
                Uninitialized: {
                  always: [
                    {
                      target: 'EnteringName',
                      cond: 'isMissingName',
                    },
                    { target: 'Idle' },
                  ],
                },
                Idle: {
                  on: {
                    START_GAME: {
                      actions: ({ store }, event) => {
                        store?.send(event);
                      },
                    },
                  },
                },
                EnteringName: {
                  on: {
                    ENTER_NAME: {
                      target: 'Idle',
                      actions: ({ store }, event) => {
                        assertEventType(event, 'ENTER_NAME');
                        store?.send(event);
                      },
                    },
                  },
                },
              },
            },
            Disconnected: {
              on: {
                RECONNECT: 'Reconnecting',
              },
            },
            Reconnecting: {
              invoke: {
                src: async ({ room }) => {
                  const sessionId = localStorage.getItem(clubRoomId);
                  if (!sessionId) {
                    throw new Error('couldnt find session id for reconnect');
                  }
                  const res = await colyseusClient.reconnect(
                    clubRoomId,
                    sessionId
                  );
                },
                onDone: 'Connected',
                onError: 'Error',
              },
            },
            Error: {
              on: {
                RETRY: 'Connecting',
              },
            },
          },
        },
        Tab: {
          meta: {
            displayName: 'Club',
            icon: <HomeIcon />,
          } as TabMetadata,
          initial: 'Unitialized',
          states: {
            Unitialized: {
              always: [
                {
                  target: 'Visible',
                  cond: ({ clubName }) => !!clubName,
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
      guards: {
        isMissingName: ({ store }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { players } = store!.getSnapshot();
          return !players[userId];
        },
      },
      services: {
        onDisconnect: async ({ room }) =>
          new Promise((resolve) => {
            room?.onLeave(resolve);
          }),
      },
      actions: {
        setClubName: assign<ClubTabContext, ClubTabEvent>({
          clubName: (_, event) => {
            assertEventType(event, 'CONNECT');
            return event.clubName;
          },
        }),
        updateUrl: (_, event) => {
          assertEventType(event, 'CONNECT');
          const { clubName } = event;
          window.history.pushState({ clubName }, '', clubName);
        },
      },
    }
  );
};

export type ClubTabMachine = ReturnType<typeof createClubTabMachine>;
export type ClubTabActor = ActorRefFrom<ClubTabMachine>;
export type ClubTabState = StateFrom<ClubTabMachine>;
