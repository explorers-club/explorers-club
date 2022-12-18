import { TriviaJamRoomCommand } from '@explorers-club/commands';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus.js';
import {
  bindCallback,
  filter,
  first,
  firstValueFrom,
  ObjectUnsubscribedError,
} from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

interface TriviaJamRoomContext {
  room: Room<TriviaJamState>;
}

export const triviaJamRoomMachine = createMachine(
  {
    id: 'TriviaJamRoomMachine',
    initial: 'Initializing',
    schema: {
      context: {} as TriviaJamRoomContext,
      events: {} as TriviaJamRoomCommand,
    },
    states: {
      Initializing: {
        always: [
          {
            target: 'Playing',
            cond: 'allPlayersConnected',
          },
          {
            target: 'Waiting',
          },
        ],
        // invoke: {
        //   src: ({ room }) =>
        //     // Waits until all players in the room are connected
        //     new Promise((resolve) => {
        //       // const state = room.state;
        //       room.state.players.onChange = (player, key) => {
        //         const players = Array.from(room.state.players.values());
        //         const allConnected =
        //           players.filter((player) => !player.connected).length === 0;

        //         if (!allConnected) {
        //           return;
        //         }

        //         resolve(null);
        //       };
        //     }),
        //   onDone: 'Playing',
        // },
      },
      Waiting: {
        invoke: {
          src: ({ room }) =>
            // Waits until all players in the room are connected
            new Promise((resolve) => {
              // const state = room.state;
              room.state.players.onChange = (player, key) => {
                const players = Array.from(room.state.players.values());
                const allConnected =
                  players.filter((player) => !player.connected).length === 0;

                if (!allConnected) {
                  return;
                }

                resolve(null);
              };
            }),
          onDone: 'Playing',
        },
      },
      Playing: {},
      GameOver: {},
    },
    predictableActionArguments: true,
  },
  {
    guards: {
      allPlayersConnected: ({ room }) => {
        const players = Array.from(room.state.players.values());
        const allConnected =
          players.filter((player) => !player.connected).length === 0;
        return allConnected;
      },
    },
  }
);

export type TriviaJamRoomMachine = typeof triviaJamRoomMachine;
export type TriviaJamRoomService = ActorRefFrom<TriviaJamRoomMachine>;
export type TriviaJamRoomState = StateFrom<TriviaJamRoomMachine>;
