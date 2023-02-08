import { LittleVigilanteServerEvent } from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { assertEventType, shuffle } from '@explorers-club/utils';
import { A, pipe } from '@mobily/ts-belt';
import { Room } from 'colyseus';
import { createSelector } from 'reselect';
import { ActorRefFrom, createMachine } from 'xstate';

export interface LittleVigilanteServerContext {
  room: Room<LittleVigilanteState>;
}

export const createLittleVigilanteServerMachine = (
  room: Room<LittleVigilanteState>,
  settings: {
    votingTimeSeconds: number;
    discussionTimeSeconds: number;
    roundsToPlay: number;
  }
) => {
  const littleVigilanteMachine = createMachine(
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
              onDone: [
                {
                  target: 'AwaitingNext',
                  cond: 'hasMoreRounds',
                  actions: ({ room }) => (room.state.currentRound += 1),
                },
                {
                  target: 'NoMoreRounds',
                },
              ],
              states: {
                AssigningRoles: {
                  entry: 'assignRoles',
                  after: {
                    5000: 'NightPhase',
                  },
                },
                NightPhase: {
                  initial: 'Cop',
                  onDone: 'DiscussionPhase',
                  states: {
                    Cop: {
                      always: {
                        target: 'Vigilante',
                        cond: ({ room }) => !room.state.roles.includes('cop'),
                      },
                      after: {
                        5000: {
                          target: 'Vigilante',
                          cond: ({ room }) =>
                            !selectInitialCopPlayer(room.state),
                        },
                      },
                      on: {
                        ARREST: {
                          target: 'Vigilante',
                          actions: 'arrestPlayer',
                        },
                      },
                    },
                    Vigilante: {
                      after: {
                        5000: 'Butler',
                      },
                    },
                    Butler: {
                      always: {
                        target: 'Twins',
                        cond: ({ room }) =>
                          !room.state.roles.includes('butler'),
                      },
                      after: {
                        5000: 'Twins',
                      },
                    },
                    Twins: {
                      always: {
                        target: 'Detective',
                        cond: ({ room }) =>
                          !room.state.roles.includes('twin_boy') &&
                          !room.state.roles.includes('twin_girl'),
                      },
                      after: {
                        5000: 'Detective',
                      },
                    },
                    Detective: {
                      always: {
                        target: 'Conspirator',
                        cond: ({ room }) =>
                          !room.state.roles.includes('detective'),
                      },
                      after: {
                        10000: 'Conspirator',
                        5000: {
                          target: 'Conspirator',
                          cond: ({ room }) =>
                            selectDetectiveIsArrested(room.state) ||
                            !selectInitialDetectivePlayer(room.state),
                        },
                      },
                      on: {
                        CONTINUE: 'Conspirator',
                      },
                    },
                    Conspirator: {
                      always: {
                        target: 'Politician',
                        cond: ({ room }) =>
                          !room.state.roles.includes('conspirator'),
                      },
                      after: {
                        5000: {
                          target: 'Politician',
                          cond: ({ room }) =>
                            selectConspiratorIsArrested(room.state) ||
                            !selectInitialConspiratorPlayer(room.state),
                        },
                      },
                      on: {
                        SWAP: {
                          target: 'Politician',
                          actions: 'swapPlayers',
                        },
                      },
                    },
                    Politician: {
                      always: {
                        target: 'Sidekick',
                        cond: ({ room }) =>
                          !room.state.roles.includes('politician'),
                      },
                      after: {
                        5000: {
                          target: 'Sidekick',
                          cond: ({ room }) =>
                            selectPoliticianIsArrested(room.state) ||
                            !selectInitialPoliticianPlayer(room.state),
                        },
                      },
                      on: {
                        SWAP: {
                          target: 'Sidekick',
                          actions: 'swapPlayers',
                        },
                      },
                    },
                    Sidekick: {
                      always: {
                        target: 'Monk',
                        cond: ({ room }) =>
                          !room.state.roles.includes('sidekick'),
                      },
                      after: {
                        5000: 'Monk',
                      },
                    },
                    Monk: {
                      always: {
                        target: 'Complete',
                        cond: ({ room }) => !room.state.roles.includes('monk'),
                      },
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
                  entry: ({ room }) =>
                    (room.state.timeRemaining = settings.discussionTimeSeconds),
                  initial: 'Idle',
                  onDone: 'Voting',
                  states: {
                    Idle: {
                      on: {
                        CALL_VOTE: {
                          target: 'VoteCalled',
                          actions({ room }, { userId }) {
                            room.state.calledVoteResponses.clear();
                            room.state.calledVoteResponses.set(userId, true);
                          },
                        },
                        TARGET_ROLE: {
                          actions(context, { role, userId, targetedUserId }) {
                            const currentRoundRoleTargets =
                              context.room.state.players.get(
                                userId
                              )?.currentRoundRoleTargets;
                            if (!currentRoundRoleTargets) {
                              return;
                            }

                            // If same role targeted, toggle off
                            if (
                              currentRoundRoleTargets.get(targetedUserId) ===
                              role
                            ) {
                              currentRoundRoleTargets.delete(targetedUserId);
                              return;
                            }

                            // Otherwise make sure we don't ever have
                            // more than one person per role
                            const userIdsByRole: Record<string, string[]> = {};
                            currentRoundRoleTargets.forEach(
                              (userRole, userId) => {
                                userIdsByRole[userRole] ||= [];
                                userIdsByRole[userRole].push(userId);
                              }
                            );

                            while (userIdsByRole[role]?.length) {
                              const userId = userIdsByRole[role].pop();
                              if (userId) {
                                currentRoundRoleTargets.delete(userId);
                              }
                            }

                            currentRoundRoleTargets.set(targetedUserId, role);
                          },
                        },
                      },
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
                    VoteCalled: {
                      always: [
                        {
                          target: 'VoteFailed',
                          cond: ({ room }) => {
                            const majorityNo = selectCalledVoteMajorityNo(
                              room.state
                            );
                            return majorityNo;
                          },
                        },
                        {
                          target: 'Complete',
                          cond: ({ room }) => {
                            const majorityYes = selectCalledVoteMajorityYes(
                              room.state
                            );
                            return majorityYes;
                          },
                        },
                        {
                          target: 'VoteFailed',
                          cond: ({ room }) => {
                            const allPlayersVoted = selectAllPlayersVoted(
                              room.state
                            );
                            return allPlayersVoted;
                          },
                        },
                      ],
                      on: {
                        APPROVE_VOTE: {
                          target: 'VoteCalled',
                          actions: ({ room }, event) => {
                            room.state.calledVoteResponses.set(
                              event.userId,
                              true
                            );
                          },
                        },
                        REJECT_VOTE: {
                          target: 'VoteCalled',
                          actions: ({ room }, event) => {
                            room.state.calledVoteResponses.set(
                              event.userId,
                              false
                            );
                          },
                        },
                      },
                    },
                    VoteFailed: {
                      after: {
                        5000: 'Idle',
                      },
                    },
                    Complete: {
                      type: 'final',
                    },
                  },
                },
                Voting: {
                  entry: ({ room }) =>
                    (room.state.timeRemaining = settings.votingTimeSeconds),
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
                  exit: ['clearRoundState'],
                  type: 'final' as const,
                },
              },
            },
            NoMoreRounds: {
              type: 'final' as const,
            },
          },
        },
        GameOver: {
          entry: ({ room }) => {
            room.disconnect();
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        hasMoreRounds: ({ room }) =>
          room.state.currentRound + 1 <= settings.roundsToPlay,
        timesUp: ({ room }) => room.state.timeRemaining <= 0,
        allPlayersConnected: ({ room }, event) =>
          selectAllPlayersConnected(room.state),
      },
      actions: {
        arrestPlayer: ({ room }, event) => {
          assertEventType(event, 'ARREST');
          room.state.currentRoundArrestedPlayerId = event.arrestedUserId;
        },
        swapPlayers: ({ room }, event) => {
          assertEventType(event, 'SWAP');
          const { firstUserId, secondUserId } = event;
          const firstUserRole =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            room.state.currentRoundRoles.get(firstUserId)!;
          const secondUserRole =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            room.state.currentRoundRoles.get(secondUserId)!;
          room.state.currentRoundRoles.set(firstUserId, secondUserRole);
          room.state.currentRoundRoles.set(secondUserId, firstUserRole);
        },
        calcCurrentRoundPoints: ({ room }) => {
          const votesByRole = Array.from(
            room.state.currentRoundVotes.entries()
          ).reduce((acc, [, votedUserId]) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const votedRole = room.state.currentRoundRoles.get(votedUserId)!;

            const votes = acc.get(votedRole) || 0;
            acc.set(votedRole, votes + 1);
            return acc;
          }, new Map<string, number>());
          const majority =
            Math.floor(Math.floor(room.state.players.size) / 2) + 1;

          const vigilanteVotes = votesByRole.get('vigilante') || 0;
          const sidekickVotes = votesByRole.get('sidekick') || 0;
          const vigilanteWins =
            vigilanteVotes < majority && sidekickVotes < majority;

          const anarchistVotes = votesByRole.get('anarchist') || 0;
          const anarachistWins = anarchistVotes >= majority;

          room.state.currentRoundRoles.forEach((role, userId) => {
            const isVigilanteTeam = VIGILANTE_TEAM.includes(role);
            const isAnarachist = role === 'anarchist';

            const points = isVigilanteTeam
              ? vigilanteWins
                ? 1
                : 0
              : isAnarachist
              ? anarachistWins
                ? 1
                : 0
              : !vigilanteWins
              ? 1
              : 0;
            room.state.currentRoundPoints.set(userId, points);
          });
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
          const playerCount = room.state.players.size;
          const allRoles = Array.from(room.state.roles.values());
          const withoutVig = allRoles.filter((role) => role !== 'vigilante');
          const gameRoles = shuffle([
            ...shuffle(withoutVig).slice(0, playerCount - 1),
            'vigilante',
          ]);

          room.state.players.forEach((player) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const role = gameRoles.pop()!;
            room.state.currentRoundRoles.set(player.userId, role);
            room.state.initialCurrentRoundRoles.set(player.userId, role);
          });
        },
        clearRoundState: ({ room }) => {
          room.state.currentRoundRoles.clear();
          room.state.currentRoundPoints.clear();
          room.state.currentRoundVotes.clear();
          room.state.currentRoundArrestedPlayerId = '';
          room.state.players.forEach((player) => {
            player.currentRoundRoleTargets.clear();
          });
        },
      },
    }
  );
  return littleVigilanteMachine;
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

const selectArrestedUserId = (state: LittleVigilanteState) =>
  state.currentRoundArrestedPlayerId;

const selectCalledVoteMajorityYes = (state: LittleVigilanteState) => {
  const numPlayers = state.players.size;

  // If we have a majority yes or no
  const majorityCount = Math.floor(numPlayers / 2) + 1;
  const yesCount = Array.from(state.calledVoteResponses.values()).filter(
    (val) => val
  ).length;
  return yesCount >= majorityCount;
};

const selectAllPlayersVoted = (state: LittleVigilanteState) => {
  const numPlayers = state.players.size;
  const numResponses = state.calledVoteResponses.size;

  return numPlayers === numResponses;
};

const selectCalledVoteMajorityNo = (state: LittleVigilanteState) => {
  const numPlayers = state.players.size;

  // If we have a majority yes or no
  const majorityCount = Math.floor(numPlayers / 2) + 1;
  const noCount = Array.from(state.calledVoteResponses.values()).filter(
    (val) => !val
  ).length;
  return noCount >= majorityCount;
};

const createInitialPlayersInRoleSelector =
  (role: string) => (state: LittleVigilanteState) => {
    return Array.from(state.initialCurrentRoundRoles.entries())
      .filter(([_, playerRole]) => {
        return playerRole === role;
      })
      .map(([userId]) => userId);
  };

const createInitialPlayerInRoleSelector =
  (role: string) => (state: LittleVigilanteState) =>
    pipe(state, createInitialPlayersInRoleSelector(role), A.head);

const selectInitialCopPlayer = createInitialPlayerInRoleSelector('cop');

const selectInitialButlerPlayer = createInitialPlayerInRoleSelector('butler');

const selectInitialDetectivePlayer =
  createInitialPlayerInRoleSelector('detective');

const selectDetectiveIsArrested = createSelector(
  selectInitialDetectivePlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectInitialConspiratorPlayer =
  createInitialPlayerInRoleSelector('conspirator');

const selectConspiratorIsArrested = createSelector(
  selectInitialConspiratorPlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectInitialPoliticianPlayer =
  createInitialPlayerInRoleSelector('politician');

const selectPoliticianIsArrested = createSelector(
  selectInitialPoliticianPlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectSidekickPlayer = createInitialPlayerInRoleSelector('sidekick');

const selectMonkPlayer = createInitialPlayerInRoleSelector('monk');

const VIGILANTE_TEAM = ['vigilante', 'sidekick', 'butler'];
