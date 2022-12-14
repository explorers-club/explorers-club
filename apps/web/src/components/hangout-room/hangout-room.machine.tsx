import { HangoutState } from '@explorers-club/schema';
import { Room } from 'colyseus.js';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { assign } from 'xstate/lib/actions';

interface HangoutRoomContext {
  room: Room<HangoutState>;
}

type HangoutRoomEvent = { type: 'ENTER_NAME'; playerName: string };

export const hangoutRoomMachine = createMachine(
  {
    id: 'HangoutRoomMachine',
    initial: 'Initializing',
    schema: {
      context: {} as HangoutRoomContext,
      events: {} as HangoutRoomEvent,
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
              room.send('SET_NAME', event.playerName);
            },
          },
        },
      },
      Idle: {},
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
