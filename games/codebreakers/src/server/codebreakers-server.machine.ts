import { CodebreakersCommand } from '@explorers-club/room';
import { CodebreakersState } from '@explorers-club/schema-types/CodebreakersState';
import { Room } from 'colyseus';
import { ActorRefFrom, createMachine } from 'xstate';

export interface CodebreakersServerContext {
  room: Room<CodebreakersState>;
}

export type CodebreakersServerEvent = CodebreakersCommand & {
  userId: string;
};

export const createCodebreakersServerMachine = (
  room: Room<CodebreakersState>
) => {
  return createMachine(
    {
      id: 'CodebreakersServerMachine',
      initial: 'Initializing',
      context: {
        room,
      },
      schema: {
        context: {} as CodebreakersServerContext,
        events: {} as CodebreakersServerEvent,
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
        Playing: {},
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
};

type CodebreakersServerMachine = ReturnType<
  typeof createCodebreakersServerMachine
>;
export type CodebreakersServerService = ActorRefFrom<CodebreakersServerMachine>;

const selectAllPlayersConnected = (state: CodebreakersState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0;
};

// const selectSerializedState = (state: CodebreakersState) => {
//   return state.toJSON() as SerializedSchema<CodebreakersState>;
// };
