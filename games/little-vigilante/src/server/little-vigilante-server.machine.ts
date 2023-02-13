import {
  LittleVigilanteServerEvent,
  PressDownCommand,
  ServerEvent,
} from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { assertEventType, shuffle } from '@explorers-club/utils';
import { A, pipe } from '@mobily/ts-belt';
import { Room } from 'colyseus';
import { createSelector } from 'reselect';
import { ActorRefFrom, createMachine, send } from 'xstate';
import { Role, rolesByTeam } from '../meta/little-vigilante.constants';
// import { getTranslation } from '../i18n';

export interface LittleVigilanteServerContext {
  room: Room<LittleVigilanteState>;
}

type Guard = (
  context: LittleVigilanteServerContext,
  event: LittleVigilanteServerEvent
) => boolean;

// const sendResume = send<LittleVigilanteServerContext, LittleVigilanteServerEvent>({ type: "RESUME"})
const sendResume = send<
  LittleVigilanteServerContext,
  ServerEvent<PressDownCommand>
>((context, event) => ({
  type: 'RESUME',
  ts: event.ts,
}));

const sendPause = send<
  LittleVigilanteServerContext,
  LittleVigilanteServerEvent
>((context, event) => {
  const idlePlayers = selectIdlePlayers(context.room.state);
  // todo sort this
  return {
    type: 'PAUSE',
    ts: context.room.state.currentTick,
    userId: idlePlayers[0]?.userId,
  };
});

// const abilityGroupLogSend = (abilityGroup: AbilityGroup) =>
//   send<LittleVigilanteServerContext, LittleVigilanteServerEvent>(
//     ({ room }, event) => {
//       // room.state.currentStates
//       console.log(abilityGroup);

//       return {
//         type: 'LOG',
//         level: 'INFO',
//         message: 'ability group log',
//       };
//     }
//   );

const hasNoTwins: Guard = ({ room }) =>
  !room.state.roles.includes('twin_boy') &&
  !room.state.roles.includes('twin_girl');
const hasNoSnitch: Guard = ({ room }) => !room.state.roles.includes('snitch');
const hasNoMonk: Guard = ({ room }) => !room.state.roles.includes('monk');
const hasNoConArtist: Guard = ({ room }) =>
  !room.state.roles.includes('con_artist');
const hasNoDetective: Guard = ({ room }) =>
  !room.state.roles.includes('detective');
const hasNoCop: Guard = ({ room }) => !room.state.roles.includes('cop');
const hasNoButler: Guard = ({ room }) => !room.state.roles.includes('butler');

const hasNoCopPlayer: Guard = ({ room }) => !selectInitialCopPlayer(room.state);
const hasNoConArtistPlayer: Guard = ({ room }) =>
  !selectInitialConArtistPlayer(room.state);
const hasNoSnitchPlayer: Guard = ({ room }) =>
  !selectInitialSnitchPlayer(room.state);

const isSnitchArrested: Guard = ({ room }) =>
  !selectSnitchIsArrested(room.state);
const isConArtistArrested: Guard = ({ room }) =>
  !selectConArtistIsArrested(room.state);

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
            // todo connects only work in club, not game rooms yet
            RECONNECT: {
              actions: ({ room }, event) => {
                const player = room.state.players.get(event.userId);
                if (player) {
                  player.connected = true;
                }
              },
            },
            DISCONNECT: {
              actions: ({ room }, event) => {
                const player = room.state.players.get(event.userId);
                if (player) {
                  player.connected = false;
                }
              },
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
                  onDone: 'DiscussionPhase',
                  type: 'parallel',
                  states: {
                    Timer: {
                      initial: 'Initializing',
                      states: {
                        Initializing: {
                          always: {
                            target: 'Running',
                            actions: 'setInitialLastDownState',
                          },
                        },
                        Paused: {
                          on: {
                            PRESS_UP: [
                              {
                                actions: ['unsetPress'],
                              },
                            ],
                            PRESS_DOWN: [
                              {
                                target: 'Running',
                                actions: ['setPress', sendResume],
                                cond: 'noPlayerIdle',
                              },
                              {
                                actions: 'setPress',
                              },
                            ],
                          },
                        },
                        Running: {
                          type: 'final',
                          always: [
                            {
                              target: 'Paused',
                              cond: 'anyPlayerIdle',
                              actions: sendPause,
                            },
                          ],
                          after: {
                            10000: {
                              target: 'Paused',
                              cond: 'anyPlayerIdle',
                              actions: sendPause,
                            },
                          },
                          on: {
                            PRESS_DOWN: [
                              {
                                actions: 'setPress',
                              },
                            ],
                            PRESS_UP: [
                              {
                                target: 'Running',
                                actions: 'unsetPress',
                              },
                            ],
                          },
                        },
                      },
                    },
                    AbilityGroup: {
                      initial: 'Running',
                      states: {
                        Paused: {
                          on: {
                            RESUME: 'Running.History',
                          },
                        },
                        Running: {
                          on: {
                            PAUSE: 'Paused',
                          },
                          onDone: 'Done',
                          initial: 'Cop',
                          states: {
                            History: {
                              type: 'history',
                              history: 'shallow',
                            },
                            Cop: {
                              always: [
                                {
                                  target: 'Vigilantes',
                                  cond: hasNoCop,
                                },
                              ],
                              after: {
                                6000: {
                                  target: 'Vigilantes',
                                  cond: hasNoCopPlayer,
                                },
                              },
                              on: {
                                ARREST: {
                                  target: 'Vigilantes',
                                  actions: 'arrestPlayer',
                                },
                              },
                            },
                            Vigilantes: {
                              after: {
                                5000: 'Butler',
                              },
                            },
                            Butler: {
                              always: [
                                {
                                  target: 'Twins',
                                  cond: hasNoButler,
                                },
                              ],
                              after: {
                                5000: 'Twins',
                              },
                            },
                            Twins: {
                              always: [
                                {
                                  target: 'Detective',
                                  cond: hasNoTwins,
                                },
                              ],
                              after: {
                                5000: 'Detective',
                              },
                            },
                            Detective: {
                              always: [
                                {
                                  target: 'ConArtist',
                                  cond: hasNoDetective,
                                },
                              ],
                              after: {
                                6000: {
                                  target: 'ConArtist',
                                },
                              },
                            },
                            ConArtist: {
                              always: [
                                {
                                  target: 'Snitch',
                                  cond: hasNoConArtist,
                                },
                              ],
                              after: {
                                // todo make random
                                6000: [
                                  {
                                    target: 'Snitch',
                                    cond: hasNoConArtistPlayer,
                                  },
                                  {
                                    target: 'Snitch',
                                    cond: isConArtistArrested,
                                  },
                                ],
                              },
                              on: {
                                SWAP: {
                                  target: 'Snitch',
                                  actions: 'swapPlayers',
                                },
                              },
                            },
                            Snitch: {
                              always: [
                                {
                                  target: 'Monk',
                                  cond: hasNoSnitch,
                                },
                              ],
                              after: {
                                6000: [
                                  {
                                    target: 'Monk',
                                    cond: hasNoSnitchPlayer,
                                  },
                                  {
                                    target: 'Monk',
                                    cond: isSnitchArrested,
                                  },
                                ],
                              },
                              on: {
                                SWAP: {
                                  target: 'Monk',
                                  actions: 'swapPlayers',
                                },
                              },
                            },
                            Monk: {
                              after: {
                                5000: 'NoAbility',
                              },
                              always: [
                                {
                                  target: 'NoAbility',
                                  cond: hasNoMonk,
                                },
                              ],
                            },
                            NoAbility: {
                              type: 'final',
                            },
                          },
                        },
                        Done: {
                          type: 'final' as const,
                        },
                      },
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
        noPlayerIdle: ({ room }, event) => {
          const idlePlayers = selectIdlePlayers(room.state);
          const idleUserIds = idlePlayers.map((player) => player.userId);
          if (event.type === 'PRESS_DOWN') {
            return idleUserIds.length === 1 && idleUserIds[0] === event.userId;
          } else {
            return idleUserIds.length === 0;
          }
        },
        anyPlayerIdle: ({ room }, event) =>
          selectIdlePlayers(room.state).length > 0,
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
        setInitialLastDownState: ({ room }, event) => {
          room.state.players.forEach((player, userId) => {
            room.state.lastDownState.set(userId, room.state.currentTick);
          });
        },
        setPress: ({ room }, event) => {
          room.state.currentDownState.set(event.userId, true);
        },
        unsetPress: ({ room }, event) => {
          room.state.currentDownState.delete(event.userId);
          room.state.lastDownState.set(event.userId, event.ts);
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
          const voteCounts = Array.from(votesByRole.values());
          const mostVotes = Math.max(...voteCounts);

          const vigilanteVotes = votesByRole.get('vigilante') || 0;
          const sidekickVotes = votesByRole.get('sidekick') || 0;

          const anarchistVotes = votesByRole.get('anarchist') || 0;
          const anarchistWins = anarchistVotes >= mostVotes;
          const citizensWin =
            !anarchistWins &&
            (vigilanteVotes >= mostVotes || sidekickVotes >= mostVotes);

          room.state.currentRoundRoles.forEach((role, userId) => {
            const isCitizensTeam = rolesByTeam.citizens.includes(role as Role);
            const isAnarachist = role === 'anarchist';

            const points = isCitizensTeam
              ? citizensWin
                ? 1
                : 0
              : isAnarachist
              ? anarchistVotes
                ? 1
                : 0
              : !citizensWin
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

const selectInitialConArtistPlayer =
  createInitialPlayerInRoleSelector('con_artist');

const selectConArtistIsArrested = createSelector(
  selectInitialConArtistPlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectSnitchIsArrested = createSelector(
  selectInitialConArtistPlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectInitialSnitchPlayer = createInitialPlayerInRoleSelector('snitch');

const selectIdlePlayers = (state: LittleVigilanteState) =>
  Array.from(state.players.values())
    .filter((player) => {
      // Not idle if current press state is down
      if (state.currentDownState.get(player.userId)) {
        return false;
      }

      // Not idle if they have a down state within the timeout window
      const ts = state.lastDownState.get(player.userId);
      const TIMEOUT_SECONDS = 10;
      const TICK_TIMEOUT_SECONDS_AGO = state.currentTick - 60 * TIMEOUT_SECONDS;
      if (ts && ts >= TICK_TIMEOUT_SECONDS_AGO) {
        return false;
      }

      return true;
    })
    .sort(
      (playerA, playerB) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.lastDownState.get(playerA.userId)! -
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.lastDownState.get(playerB.userId)!
    );
