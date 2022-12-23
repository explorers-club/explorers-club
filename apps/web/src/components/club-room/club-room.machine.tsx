import {
  ClubRoomCommand,
  CLUB_ROOM_ENTER_NAME,
} from '@explorers-club/commands';
import { assertEventType } from '@explorers-club/utils';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { ClubStore } from '../../type';

interface ClubRoomContext {
  store: ClubStore;
  myUserId: string;
}

export const clubRoomMachine = createMachine(
  {
    id: 'ClubRoomMachine',
    initial: 'Loading',
    schema: {
      context: {} as ClubRoomContext,
      events: {} as ClubRoomCommand,
    },
    states: {
      // TODO might still need to wait for store to load?
      Loading: {
        invoke: {
          src: ({ store }) =>
            new Promise((resolve) => {
              // todo use observable here
              const unsub = store.subscribe(() => {
                resolve(null);
                unsub();
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
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      setHostPlayerName: ({ store, myUserId }) => {
        const playerName = store.id.replace('club-', '');
        console.log('setting', playerName);
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
