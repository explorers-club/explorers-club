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
    initial: 'Loading',
    schema: {
      context: {} as HangoutRoomContext,
      events: {} as HangoutRoomCommand,
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

export type HangoutRoomMachine = typeof hangoutRoomMachine;
export type HangoutRoomService = ActorRefFrom<HangoutRoomMachine>;
export type HangoutRoomState = StateFrom<HangoutRoomMachine>;
