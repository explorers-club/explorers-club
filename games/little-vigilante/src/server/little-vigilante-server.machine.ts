import {
  LittleVigilanteMessageCommand,
  LittleVigilanteServerEvent,
  LittleVigilanteStateSerialized,
  PauseCommand,
  PressDownCommand,
  ResumeCommand,
  ServerEvent,
  UserSenderSchema,
} from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { assertEventType, shuffle } from '@explorers-club/utils';
import { A, pipe } from '@mobily/ts-belt';
import { Client, Room } from 'colyseus';
import { createSelector } from 'reselect';
import { ActorRefFrom, createMachine, send } from 'xstate';
import { Role, rolesByTeam } from '../meta/little-vigilante.constants';
import { selectPlayerOutcomes } from '../state/little-vigilante.selectors';
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
>(
  (_, event) =>
    ({
      type: 'RESUME',
      ts: event.ts,
      sender: {
        type: 'server',
      },
    } as ServerEvent<ResumeCommand>)
);

const sendPause = send<
  LittleVigilanteServerContext,
  LittleVigilanteServerEvent
>((context, event) => {
  const idlePlayers = selectIdlePlayers(context.room.state);
  const userId = idlePlayers[0]?.userId;
  // todo sort this
  return {
    type: 'PAUSE',
    ts: context.room.state.currentTick,
    userId,
    sender: {
      type: 'server',
    },
  } as ServerEvent<PauseCommand>;
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
  // todo just use context for this
  const cacheMap = new Map();

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
                SET_ROLES: {
                  actions: ({ room }, event) => {
                    room.state.roles.clear();
                    event.roles.forEach((role) => room.state.roles.push(role));
                  },
                },
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
                  entry: 'sendNightPhaseMessage',
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
                  entry: [
                    ({ room }) =>
                      (room.state.timeRemaining =
                        settings.discussionTimeSeconds),
                    'sendDiscussionPhaseMessage',
                  ],
                  initial: 'Idle',
                  onDone: [
                    {
                      target: 'Reveal',
                      cond: 'hasCalledVoteMajorityYes',
                    },
                    {
                      target: 'Voting',
                    },
                  ],
                  states: {
                    Idle: {
                      entry: () => {
                        const timeRemaining = cacheMap.get(
                          'discussion_time_remaining'
                        );
                        if (timeRemaining) {
                          cacheMap.delete('discussion_time_remaining');
                          room.state.timeRemaining = timeRemaining;
                        }
                      },
                      on: {
                        CALL_VOTE: {
                          target: 'VoteCalled',
                          actions({ room }, { sender, targetedUserId }) {
                            // Store the current time remaining in cache to resume from later...
                            cacheMap.set(
                              'discussion_time_remaining',
                              room.state.timeRemaining
                            );
                            room.state.timeRemaining = 15;

                            const { userId } = UserSenderSchema.parse(sender);
                            room.state.calledVoteUserId = userId;
                            room.state.calledVoteTargetedUserId =
                              targetedUserId;
                            room.state.calledVoteResponses.clear();
                            room.state.calledVoteResponses.set(userId, true);
                          },
                        },
                        TARGET_ROLE: {
                          actions(context, { role, sender, targetedUserId }) {
                            const { userId } = UserSenderSchema.parse(sender);
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
                            actions: 'discussionTimerTick',
                          },
                        ],
                      },
                    },
                    VoteCalled: {
                      after: {
                        1000: [
                          {
                            target: 'VoteCalled',
                            actions: 'votingTimerTick',
                          },
                        ],
                      },
                      always: [
                        {
                          target: 'VoteFailed',
                          cond: 'hasCalledVoteMajorityNo',
                        },
                        {
                          target: 'Complete',
                          cond: 'hasCalledVoteMajorityYes',
                          actions: () => {
                            // All the people who voted yes,
                            // mark their vote as the targeted person
                            // Everybody who vote no or didn't vote won't count
                            // when the round votes are calcualted
                            room.state.calledVoteResponses.forEach(
                              (response, userId) => {
                                if (response) {
                                  room.state.currentRoundVotes.set(
                                    userId,
                                    room.state.calledVoteTargetedUserId
                                  );
                                }
                              }
                            );
                          },
                        },
                        {
                          target: 'VoteFailed',
                          cond: ({ room }) => {
                            const allPlayersVoted = selectAllPlayersVoted(
                              room.state
                            );
                            return (
                              allPlayersVoted || room.state.timeRemaining <= 0
                            );
                          },
                        },
                      ],
                      on: {
                        APPROVE_VOTE: {
                          target: 'VoteCalled',
                          actions: ({ room }, event) => {
                            const { userId } = UserSenderSchema.parse(
                              event.sender
                            );
                            room.state.calledVoteResponses.set(userId, true);
                          },
                        },
                        REJECT_VOTE: {
                          target: 'VoteCalled',
                          actions: ({ room }, event) => {
                            const { userId } = UserSenderSchema.parse(
                              event.sender
                            );
                            room.state.calledVoteResponses.set(userId, false);
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
                      // todo skip the voting screen and just manually score
                    },
                  },
                },
                Voting: {
                  entry: [
                    ({ room }) =>
                      (room.state.timeRemaining = settings.votingTimeSeconds),
                    'sendVotePhaseMessage',
                  ],
                  initial: 'Idle',
                  onDone: 'Reveal',
                  on: {
                    VOTE: {
                      actions: ({ room }, event) => {
                        const { userId } = UserSenderSchema.parse(event.sender);
                        room.state.currentRoundVotes.set(
                          userId,
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
                            actions: 'votingTimerTick',
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
                  entry: [
                    'calcCurrentRoundPoints',
                    'sendWinStatusMessage',
                    'sendRevealPhaseMessage',
                  ],
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
            const { userId } = UserSenderSchema.parse(event.sender);
            return idleUserIds.length === 1 && idleUserIds[0] === userId;
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
        hasCalledVoteMajorityNo: ({ room }) =>
          selectCalledVoteMajorityNo(room.state),
        hasCalledVoteMajorityYes: ({ room }) =>
          selectCalledVoteMajorityYes(room.state),
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
          const { userId } = UserSenderSchema.parse(event.sender);
          room.state.currentDownState.set(userId, true);
        },
        unsetPress: ({ room }, event) => {
          const { userId } = UserSenderSchema.parse(event.sender);
          room.state.currentDownState.delete(userId);
          room.state.lastDownState.set(userId, event.ts);
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
        discussionTimerTick: ({ room }) => {
          const timeRemaining = room.state.timeRemaining - 1;
          room.state.timeRemaining = timeRemaining;
          let event: ServerEvent<LittleVigilanteMessageCommand> | undefined;
          if (timeRemaining > 0 && timeRemaining <= 5) {
            event = {
              type: 'MESSAGE',
              ts: room.state.currentTick,
              message: {
                text: timeRemaining > 1 ? `${timeRemaining}...` : '1',
              },
              sender: {
                type: 'server',
              },
            };
          } else if (timeRemaining === 30) {
            event = {
              type: 'MESSAGE',
              ts: room.state.currentTick,
              message: {
                text: '30 seconds left',
              },
              sender: {
                type: 'server',
              },
            };
          }

          if (event) {
            room.broadcast(event.type, event);
          }
        },
        votingTimerTick: ({ room }) => {
          const timeRemaining = room.state.timeRemaining - 1;
          room.state.timeRemaining = timeRemaining;
          let event: ServerEvent<LittleVigilanteMessageCommand> | undefined;
          if (timeRemaining > 0 && timeRemaining <= 3) {
            event = {
              type: 'MESSAGE',
              ts: room.state.currentTick,
              message: {
                text: timeRemaining > 1 ? `${timeRemaining}...` : '1',
              },
              sender: {
                type: 'server',
              },
            };
          }

          if (event) {
            room.broadcast(event.type, event);
          }
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
          const clientsByUserId = room.clients.reduce((result, client) => {
            if (client.userData) {
              const userId = client.userData['userId'];
              result[userId] = client;
            }
            return result;
          }, {} as Record<string, Client>);

          room.state.players.forEach(({ userId }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const role = gameRoles.pop()! as Role;
            room.state.currentRoundRoles.set(userId, role);
            room.state.initialCurrentRoundRoles.set(userId, role);

            const event: ServerEvent<LittleVigilanteMessageCommand> = {
              type: 'MESSAGE',
              ts: room.state.currentTick,
              message: {
                K: 'role_assign',
                P: { role },
              },
              sender: {
                type: 'server',
                isPrivate: true,
              },
            };

            clientsByUserId[userId].send(event.type, event);
          });
        },
        sendDiscussionPhaseMessage: ({ room }) => {
          const event: ServerEvent<LittleVigilanteMessageCommand> = {
            type: 'MESSAGE',
            ts: room.state.currentTick,
            message: 'discuss',
            sender: {
              type: 'server',
              isPrivate: false,
            },
          };
          room.broadcast(event.type, event);
        },
        sendVotePhaseMessage: ({ room }) => {
          const event: ServerEvent<LittleVigilanteMessageCommand> = {
            type: 'MESSAGE',
            ts: room.state.currentTick,
            message: 'vote',
            sender: {
              type: 'server',
            },
          };
          room.broadcast(event.type, event);
        },
        sendWinStatusMessage: ({ room }) => {
          const clientsByUserId = room.clients.reduce((result, client) => {
            if (client.userData) {
              const userId = client.userData['userId'];
              result[userId] = client;
            }
            return result;
          }, {} as Record<string, Client>);

          const playerOutcomes = selectPlayerOutcomes(getSnapshot(room.state));

          playerOutcomes.forEach(({ userId, winner }) => {
            const event: ServerEvent<LittleVigilanteMessageCommand> = {
              type: 'MESSAGE',
              ts: room.state.currentTick,
              message: winner ? 'you_won' : 'you_lost',
              sender: {
                type: 'server',
                isPrivate: true,
              },
            };
            clientsByUserId[userId].send(event.type, event);
          });
        },
        sendRevealPhaseMessage: ({ room }) => {
          const playerOutcomes = selectPlayerOutcomes(getSnapshot(room.state));
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const vigilante = playerOutcomes.find(
            (player) => player.role === 'vigilante'
          )!;
          const sidekick = playerOutcomes.find(
            (player) => player.role === 'sidekick'
          );

          const event: ServerEvent<LittleVigilanteMessageCommand> = {
            type: 'MESSAGE',
            ts: room.state.currentTick,
            message: {
              K: 'winners',
              P: {
                vigilantePlayerName: vigilante.playerName,
                vigilanteSlotNumber: vigilante.slotNumber,
                sidekickPlayerName: sidekick?.playerName,
                sidekickSlotNumber: sidekick?.slotNumber,
              },
            },
            sender: {
              type: 'server',
            },
          };
          room.broadcast(event.type, event);
        },
        sendNightPhaseMessage: ({ room }) => {
          const event: ServerEvent<LittleVigilanteMessageCommand> = {
            type: 'MESSAGE',
            ts: room.state.currentTick,
            message: 'night_phase',
            sender: {
              type: 'server',
            },
          };
          room.broadcast(event.type, event);
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

const getSnapshot = (state: LittleVigilanteState) => {
  return state.toJSON() as LittleVigilanteStateSerialized;
};
