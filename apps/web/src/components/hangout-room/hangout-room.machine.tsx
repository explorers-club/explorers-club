import { HangoutRoomCommand } from '@explorers-club/commands';
import { HangoutState } from '@explorers-club/schema';
import { Room } from 'colyseus.js';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

interface HangoutRoomContext {
  room: Room<HangoutState>;
}

export const hangoutRoomMachine = createMachine(
  {
    id: 'HangoutRoomMachine',
    initial: 'Initializing',
    schema: {
      context: {} as HangoutRoomContext,
      events: {} as HangoutRoomCommand,
    },
    states: {
      Initializing: {
        always: [
          {
            target: 'EnteringName',
            cond: 'needsNameInput',
          },
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
  },
  {
    guards: {
      needsNameInput: () => {
        return true;
      },
      isNameValid: () => {
        return true;
      },
    },
  }
);

export type HangoutRoomMachine = typeof hangoutRoomMachine;
export type HangoutRoomService = ActorRefFrom<HangoutRoomMachine>;
export type HangoutRoomState = StateFrom<HangoutRoomMachine>;
