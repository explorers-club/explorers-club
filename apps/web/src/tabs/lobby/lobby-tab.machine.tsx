import { ClubMetadata } from '@explorers-club/schema';
import { TabMetadata } from '@organisms/tab-bar';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { Client, RoomAvailable } from 'colyseus.js';
import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';

type Rooms = RoomAvailable<ClubMetadata>[];

export interface LobbyTabContext {
  clubName: string;
  rooms?: Rooms;
}

export const createLobbyTabMachine = (colyseusClient: Client) =>
  createMachine({
    id: 'LobbyTabMachine',
    type: 'parallel',
    schema: {
      context: {} as LobbyTabContext,
    },
    states: {
      Rooms: {
        initial: 'Fetching',
        states: {
          Fetching: {
            invoke: {
              src: async () => colyseusClient.getAvailableRooms('club'),
              onDone: {
                target: 'Idle',
                actions: assign<LobbyTabContext, DoneInvokeEvent<Rooms>>({
                  rooms: (_, event) => event.data,
                }),
              },
              onError: 'Error',
            },
          },
          Idle: {},
          Error: {},
        },
      },
      Tab: {
        meta: {
          displayName: 'Lobby',
          icon: <ListBulletIcon />,
        } as TabMetadata,
        initial: 'Visible',
        states: {
          Visible: {},
          Hidden: {},
        },
      },
    },
  });

export type LobbyTabMachine = ReturnType<typeof createLobbyTabMachine>;
export type LobbyTabActor = ActorRefFrom<LobbyTabMachine>;
export type LobbyTabState = StateFrom<LobbyTabMachine>;
