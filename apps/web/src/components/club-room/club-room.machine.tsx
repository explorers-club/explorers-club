import { ClubRoomCommand } from '@explorers-club/commands';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { Room } from 'colyseus.js';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

interface ClubRoomContext {
  room: Room<ClubState>;
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
      Loading: {
        invoke: {
          src: ({ room }) =>
            new Promise((resolve) => room.onStateChange.once(resolve)),
          onDone: 'Initializing',
        },
      },
      Initializing: {
        always: [
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
            actions: ({ room }, event) => {
              room.send(event.type, event);
            },
          },
        },
      },
      Idle: {
        on: {
          SELECT_GAME: {
            actions: ({ room }, event) => {
              room.send(event.type, event);
            },
          },
          START_GAME: {
            actions: ({ room }, event) => {
              room.send(event.type, event);
            },
          },
        },
      },
    },
    predictableActionArguments: true,
  },
  {
    guards: {
      needsNameInput: ({ room }) => {
        const player = room.state.players.get(room.sessionId);
        console.log(player, room.state.players.values());
        return !player?.name;
      },
      isNameValid: () => {
        return true;
      },
    },
  }
);

export type ClubRoomMachine = typeof clubRoomMachine;
export type ClubRoomService = ActorRefFrom<ClubRoomMachine>;
export type ClubRoomState = StateFrom<ClubRoomMachine>;
