import { LittleVigilanteCommand } from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { shuffle } from '@explorers-club/utils';
import { Room } from 'colyseus';
import { ActorRefFrom, createMachine } from 'xstate';

export interface LittleVigilanteServerContext {
  room: Room<LittleVigilanteState>;
}

export type LittleVigilanteServerEvent = LittleVigilanteCommand & {
  userId: string;
};

export const createLittleVigilanteServerMachine = (
  room: Room<LittleVigilanteState>
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
          initial: 'AwaitingNext',
          onDone: 'GameOver',
          states: {
            AwaitingNext: {
              on: {
                CONTINUE: 'Round',
              },
            },
            Round: {
              initial: 'NightPhase',
              entry: 'assignRoles',
              states: {
                NightPhase: {
                  initial: 'Vigilante',
                  onDone: "DiscussionPhase",
                  states: {
                    Vigilante: {
                      after: {
                        5000: 'Sidekick',
                      },
                    },
                    Sidekick: {
                      after: {
                        5000: 'Jester',
                      },
                    },
                    Jester: {
                      after: {
                        5000: 'Cops',
                      },
                    },
                    Cops: {
                      after: {
                        5000: 'Detective',
                      },
                    },
                    Detective: {
                      after: {
                        5000: 'Mayor',
                      },
                    },
                    Mayor: {
                      after: {
                        5000: 'Complete',
                      },
                    },
                    Complete: {
                      type: "final"
                    }
                  },
                },
                DiscussionPhase: {},
                Voting: {},
                Reveal: {},
                Complete: {
                  entry: 'updatePointTotals',
                  exit: ['clearCurrentRoles'],
                  type: 'final' as const,
                },
              },
            },
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
      actions: {
        assignRoles: ({ room }) => {
          const allRoles = getRoles(room.state.players.keys.length);

          // room.state.players.forEach((player) => {})
          // room.state.players.forEach((player) => {
          //   // room.state.currentRoles[player.userId] = roles.pop();
          //   // const role = roles.pop();
          //   // player.role = role;
          // });
          // room.state.currentQuestionEntryId =
          //   questions[currentQuestionIndex].sys.id;
        },
        clearCurrentRoles: ({ room }) => {
          room.state.currentRoles.clear();
        },
      },
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

function getRoles(playerCount: number) {
  const roles = [
    'vigilante',
    'sidekick',
    'butler',
    'detective',
    'cop',
    'mayor',
    'citizen',
    'citizen',
    'citizen',
  ];
  return shuffle(roles);
}
