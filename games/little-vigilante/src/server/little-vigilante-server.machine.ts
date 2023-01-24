import { LittleVigilanteCommand, SerializedSchema } from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { assertEventType, shuffle } from '@explorers-club/utils';
import { A } from '@mobily/ts-belt';
import { Room } from 'colyseus';
import { createSelector } from 'reselect';
import { ActorRefFrom, createMachine } from 'xstate';

export interface LittleVigilanteServerContext {
  room: Room<LittleVigilanteState>;
}

export type LittleVigilanteServerEvent = LittleVigilanteCommand & {
  userId: string;
};

export const createLittleVigilanteServerMachine = (
  room: Room<LittleVigilanteState>,
  settings: { votingTimeSeconds: number; discussionTimeSeconds: number }
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
                  initial: 'Cop',
                  onDone: 'DiscussionPhase',
                  states: {
                    Cop: {
                      always: {
                        target: 'Vigilante',
                        cond: ({ room }) => !selectCopPlayer(room.state),
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
                        5000: 'Student',
                      },
                    },
                    Student: {
                      always: {
                        target: 'Butler',
                        cond: ({ room }) =>
                          !selectStudentPlayers(room.state).length,
                      },
                      after: {
                        5000: 'Butler',
                      },
                    },
                    Butler: {
                      always: {
                        target: 'Detective',
                        cond: ({ room }) => !selectButlerPlayer(room.state),
                      },
                      after: {
                        5000: 'Detective',
                      },
                    },
                    Detective: {
                      always: {
                        target: 'Conspirator',
                        cond: ({ room }) => !selectDetectivePlayer(room.state),
                      },
                      after: {
                        20000: 'Conspirator',
                        5000: {
                          target: 'Conspirator',
                          cond: ({ room }) =>
                            selectDetectiveIsArrested(room.state),
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
                          !selectConspiratorPlayer(room.state),
                      },
                      after: {
                        5000: {
                          target: 'Politician',
                          cond: ({ room }) =>
                            selectConspiratorIsArrested(room.state),
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
                        cond: ({ room }) => !selectPoliticianPlayer(room.state),
                      },
                      after: {
                        5000: {
                          target: 'Sidekick',
                          cond: ({ room }) =>
                            selectPoliticianIsArrested(room.state),
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
                        cond: ({ room }) => !selectSidekickPlayer(room.state),
                      },
                      after: {
                        5000: 'Monk',
                      },
                    },
                    Monk: {
                      always: {
                        target: 'Complete',
                        cond: ({ room }) => !selectMonkPlayer(room.state),
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

          const maxVotes = Math.max(...Array.from(votesByRole.values()));

          const vigilanteVotes = votesByRole.get('vigilante') || 0;
          const sidekickVotes = votesByRole.get('sidekick') || 0;
          const vigilanteWins =
            vigilanteVotes !== maxVotes && sidekickVotes !== maxVotes;

          const anarchistVotes = votesByRole.get('anarchist') || 0;
          const anarachistWins = anarchistVotes === maxVotes;

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
            room.state.currentRoundRoles.set(player.userId, gameRoles.pop()!);
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

const selectArrestedUserId = (state: LittleVigilanteState) =>
  state.currentRoundArrestedPlayerId;

const selectSerializedState = (state: LittleVigilanteState) => {
  return state.toJSON() as SerializedSchema<LittleVigilanteState>;
};

const selectCurrentRoundRoles = createSelector(
  selectSerializedState,
  (state) => state.currentRoundRoles
);

const createPlayersInRoleSelector = (role: string) =>
  createSelector(selectCurrentRoundRoles, (currentRoles) =>
    Object.entries(currentRoles)
      .filter(([_, playerRole]) => playerRole === role)
      .map(([userId]) => userId)
  );

const selectCopPlayer = createSelector(
  createPlayersInRoleSelector('cop'),
  A.head
);

const selectVigilantePlayer = createSelector(
  createPlayersInRoleSelector('vigilante'),
  A.head
);

const selectButlerPlayer = createSelector(
  createPlayersInRoleSelector('butler'),
  A.head
);

const selectStudentPlayers = createPlayersInRoleSelector('student');

const selectDetectivePlayer = createSelector(
  createPlayersInRoleSelector('detective'),
  A.head
);

const selectDetectiveIsArrested = createSelector(
  selectDetectivePlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectConspiratorPlayer = createSelector(
  createPlayersInRoleSelector('conspirator'),
  A.head
);

const selectConspiratorIsArrested = createSelector(
  selectConspiratorPlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectPoliticianPlayer = createSelector(
  createPlayersInRoleSelector('politician'),
  A.head
);

const selectPoliticianIsArrested = createSelector(
  selectPoliticianPlayer,
  selectArrestedUserId,
  (userId, arrestedId) => userId === arrestedId
);

const selectSidekickPlayer = createSelector(
  createPlayersInRoleSelector('sidekick'),
  A.head
);

const selectMonkPlayer = createSelector(
  createPlayersInRoleSelector('monk'),
  A.head
);

const selectMayorPlayer = createSelector(
  createPlayersInRoleSelector('mayor'),
  A.head
);

const selectAnarachistPlayer = createSelector(
  createPlayersInRoleSelector('anarchist'),
  A.head
);

const VIGILANTE_TEAM = ['vigilante', 'sidekick', 'butler'];
