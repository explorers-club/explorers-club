import { LittleVigilanteCommand } from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { Room } from 'colyseus';
import { ActorRefFrom, createMachine } from 'xstate';

export interface LittleVigilanteServerContext {
  room: Room<LittleVigilanteState>;
}

export type LittleVigilanteServerEvent = LittleVigilanteCommand & {
  userId: string;
};

export const createLittleVigilanteServerMachine = (
  room: Room<LittleVigilanteState>,
) => {
  const triviaJamMachine = createMachine(
    {
      id: 'LittleVigilanteServerMachine',
      initial: 'Initializing',
      context: {
        room,
      },
      schema: {
        context: {} as LittleVigilanteServerContext,
        events: {} as LittleVigilanteServerEvent,
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
            Night: {},
            Talking: {},
            Reveal: {},
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

type LittleVigilanteServerMachine = ReturnType<
  typeof createLittleVigilanteServerMachine
>;
export type LittleVigilanteServerService =
  ActorRefFrom<LittleVigilanteServerMachine>;

const selectAllPlayersConnected = (state: LittleVigilanteState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0;
};
