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
        resetTimer: ({ room }) => {
          room.state.timeRemaining = 15;
        },
        timerTick: ({ room }) => {
          room.state.timeRemaining -= 1;
        },
        updateScores: () => {
          console.log('round complete, updating scores');
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
