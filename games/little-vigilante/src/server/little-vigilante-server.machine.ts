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
              initial: 'AssigningRoles',
              onDone: 'AwaitingNext',
              states: {
                AssigningRoles: {
                  entry: 'assignRoles',
                  after: {
                    5000: 'NightPhase',
                  },
                },
                NightPhase: {
                  initial: 'Vigilante',
                  onDone: 'DiscussionPhase',
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
                        5000: 'Cop',
                      },
                    },
                    Cop: {
                      after: {
                        5000: 'Detective',
                      },
                    },
                    Detective: {
                      after: {
                        5000: 'Butler',
                      },
                    },
                    Butler: {
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
                      type: 'final',
                    },
                  },
                },
                DiscussionPhase: {
                  entry: ({ room }) => (room.state.timeRemaining = 25),
                  initial: 'Idle',
                  onDone: 'Voting',
                  states: {
                    Idle: {
                      after: {
                        1000: [
                          {
                            target: 'Complete',
                            cond: 'timesUp',
                          },
                          {
                            target: 'Idle',
                            actions: 'timerTick',
                          },
                        ],
                      },
                    },
                    Complete: {
                      type: 'final',
                    },
                  },
                },
                Voting: {
                  entry: ({ room }) => (room.state.timeRemaining = 10),
                  initial: 'Idle',
                  onDone: 'Reveal',
                  on: {
                    VOTE: {
                      actions: ({ room }, event) => {
                        room.state.currentRoundVotes.set(
                          event.userId,
                          event.votedUserId
                        );
                      },
                    },
                  },
                  states: {
                    Idle: {
                      after: {
                        1000: [
                          {
                            target: 'Complete',
                            cond: 'timesUp',
                          },
                          {
                            target: 'Idle',
                            actions: 'timerTick',
                          },
                        ],
                      },
                    },
                    Complete: {
                      type: 'final',
                    },
                  },
                },
                Reveal: {
                  entry: 'calcCurrentRoundPoints',
                  on: {
                    CONTINUE: 'Complete',
                  },
                },
                Complete: {
                  entry: 'updateScores',
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
        timesUp: ({ room }) => room.state.timeRemaining <= 0,
        allPlayersConnected: ({ room }, event) =>
          selectAllPlayersConnected(room.state),
      },
      actions: {
        calcCurrentRoundPoints: ({ room }) => {
          const votesByRole = Array.from(
            room.state.currentRoundVotes.entries()
          ).reduce((acc, [userId, votedUserId]) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const votedRole = room.state.currentRoundRoles.get(votedUserId)!;
            const votes = acc.get(votedRole) || 0;
            acc.set(votedRole, votes + 1);
            return acc;
          }, new Map<string, number>());

          const maxVotes = Math.max(...Array.from(votesByRole.values()));

          const vigilanteVotes = votesByRole.get('vigilante') || 0;
          const vigilanteWins = vigilanteVotes === maxVotes;

          room.state.currentRoundRoles.forEach((role, userId) => {
            const isVigilanteTeam = VIGILANTE_TEAM.includes(role);

            const points = isVigilanteTeam
              ? vigilanteWins
                ? 1
                : 0
              : !vigilanteWins
              ? 1
              : 0;
            room.state.currentRoundPoints.set(userId, points);
          });
        },
        resetTimer: ({ room }) => {
          room.state.timeRemaining = 15;
        },
        timerTick: ({ room }) => {
          room.state.timeRemaining -= 1;
        },
        updateScores: () => {
          room.state.currentRoundPoints.forEach((points, userId) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            room.state.players.get(userId)!.score += points;
          });
        },
        assignRoles: ({ room }) => {
          // room.state.players
          const allRoles = getRoles(room.state.players.size);

          room.state.players.forEach((player) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            room.state.currentRoundRoles.set(player.userId, allRoles.pop()!);
          });
        },
        clearCurrentRoles: ({ room }) => {
          room.state.currentRoundRoles.clear();
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
    'cop',
    'mayor',
    'citizen',
    'citizen',
    'citizen',
  ].slice(0, playerCount);
  return shuffle(roles);
}

const VIGILANTE_TEAM = ['vigilante', 'sidekick', 'butler'];
