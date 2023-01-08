import { DiffusionaryCommand } from '@explorers-club/room';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { Room } from 'colyseus';
import { ActorRefFrom, createMachine } from 'xstate';

export interface DiffusionaryServerContext {
  room: Room<DiffusionaryState>;
}

export type DiffusionaryServerEvent = DiffusionaryCommand & {
  userId: string;
};

export const createDiffusionaryServerMachine = (
  room: Room<DiffusionaryState>,
) => {
  const triviaJamMachine = createMachine(
    {
      id: 'DiffusionaryServerMachine',
      initial: 'Initializing',
      context: {
        room,
      },
      schema: {
        context: {} as DiffusionaryServerContext,
        events: {} as DiffusionaryServerEvent,
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
        },
        Waiting: {
          on: {
            JOIN: {
              target: 'Playing',
              cond: 'allPlayersConnected',
            },
          },
        },
        Playing: {
          onDone: 'GameOver',
          initial: 'Introduction',
          states: {
            Introduction: {},
          },
        },
        GameOver: {},
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        allPlayersConnected: ({ room }, event) =>
          selectAllPlayersConnected(room.state),
      },
      actions: {},
    }
  );
  return triviaJamMachine;
};

type DiffusionaryServerMachine = ReturnType<
  typeof createDiffusionaryServerMachine
>;
export type DiffusionaryServerService =
  ActorRefFrom<DiffusionaryServerMachine>;

const selectAllPlayersConnected = (state: DiffusionaryState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0;
};
