import { ClubRoomCommand, CLUB_ROOM_ENTER_NAME } from '@explorers-club/room';
import { assertEventType } from '@explorers-club/utils';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { ClubStore } from '@explorers-club/room';

interface ClubRoomContext {
  store: ClubStore;
  myUserId: string;
}

type ConfigureEvent = { type: 'CONFIGURE' };

export const clubRoomMachine = createMachine(
  {
    id: 'ClubRoomMachine',
    initial: 'Loading',
    schema: {
      context: {} as ClubRoomContext,
      events: {} as ClubRoomCommand | ConfigureEvent,
    },
    states: {
      // TODO might still need to wait for store to load?
      Loading: {
        invoke: {
          src: ({ store }) =>
            new Promise((resolve) => {
              // todo use observable here, memory leak
              store.subscribe(() => {
                resolve(null);
              });
            }),
          onDone: 'Initializing',
        },
      },
      Initializing: {
        always: [
          {
            target: 'Idle',
            actions: 'setHostPlayerName',
            cond: 'isHost',
          },
          {
            target: 'EnteringName',
            cond: 'needsNameInput',
          },
          { target: 'Idle' },
        ],
      },
      EnteringName: {
        on: {
          ENTER_NAME: {
            target: 'Idle',
            cond: 'isNameValid',
            actions: ({ store }, event) => {
              store.send(event);
            },
          },
        },
      },
      Idle: {
        on: {
          CONFIGURE: 'Configuring',
          SELECT_GAME: {
            actions: ({ store }, event) => {
              store.send(event);
            },
          },
          START_GAME: {
            actions: ({ store }, event) => {
              store.send(event);
            },
          },
        },
      },
      Configuring: {
        on: {
          SET_GAME_CONFIG: {
            target: 'Idle',
            actions: ({ store }, event) => {
              store.send(event);
            },
          },
        },
      },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      setHostPlayerName: ({ store, myUserId }) => {
        const playerName = store.id.replace('club-', '');
        store.send({
          type: CLUB_ROOM_ENTER_NAME,
          playerName,
        });
      },
    },
    guards: {
      isHost: ({ store, myUserId }) => {
        return store.getSnapshot().hostUserId === myUserId;
      },
      needsNameInput: ({ store, myUserId }) => {
        return !store.getSnapshot().players[myUserId]?.name;
      },
      isNameValid: ({ store }, event) => {
        assertEventType(event, 'ENTER_NAME');
        const playerNames = Object.values(store.getSnapshot().players).map(
          (player) => player.name
        );
        return !playerNames.includes(event.playerName);
      },
    },
  }
);

export type ClubRoomMachine = typeof clubRoomMachine;
export type ClubRoomService = ActorRefFrom<ClubRoomMachine>;
export type ClubRoomState = StateFrom<ClubRoomMachine>;
