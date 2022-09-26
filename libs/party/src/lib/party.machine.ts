import {
  ActorID,
  ActorManager,
  SharedMachineProps,
} from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import {
  getLobbyPlayerActorId,
  LobbyPlayerActor,
} from './lobby-player.machine';

export const PLAYER_JOINED = (props: { userId: string }) => props;
export const PLAYER_DISCONNECTED = (props: { userId: string }) => props;

export type PlayerJoinedEvent = ReturnType<typeof PLAYER_JOINED>;
export type PlayerDisconnectedEvent = ReturnType<typeof PLAYER_DISCONNECTED>;

const gameMachine = createMachine({
  id: 'GameMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

const partyModel = createModel(
  {
    playerUserIds: [] as string[],
    actorManager: {} as ActorManager,
  },
  {
    events: {
      PLAYER_DISCONNECTED,
      PLAYER_JOINED,
    },
  }
);

export const PartyEvents = partyModel.events;

export const getPartyActorId = (joinCode: string) =>
  `Party-${joinCode}` as ActorID;

export const createPartyMachine = ({
  actorId,
  actorManager,
}: SharedMachineProps) =>
  partyModel.createMachine(
    {
      id: actorId,
      context: {
        playerUserIds: [],
        actorManager,
      },
      initial: 'Lobby',
      on: {
        PLAYER_JOINED: {
          actions: partyModel.assign({
            playerUserIds: (context, { userId }) => {
              return [...context.playerUserIds, userId];
            },
          }),
        },
        PLAYER_DISCONNECTED: {
          actions: partyModel.assign({
            playerUserIds: (context, { userId }) => {
              return context.playerUserIds.filter((id) => id !== userId);
            },
          }),
        },
      },
      states: {
        Lobby: {
          onDone: 'Game',
          initial: 'Waiting',
          states: {
            Waiting: {
              always: {
                target: 'AllReady',
                cond: 'allPlayersReady',
              },
            },
            AllReady: {
              always: {
                target: 'Waiting',
                cond: 'allPlayersNotReady',
              },
            },
            EnteringGame: {
              type: 'final' as const,
            },
          },
        },
        Game: {
          invoke: {
            id: 'gameActor',
            src: gameMachine,
            onDone: 'Lobby',
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        allPlayersNotReady: ({ actorManager, playerUserIds }) =>
          !getAllPlayersReady(actorManager, playerUserIds),
        allPlayersReady: ({ actorManager, playerUserIds }) =>
          getAllPlayersReady(actorManager, playerUserIds),
      },
    }
  );

const getAllPlayersReady = (
  actorManager: ActorManager,
  playerUserIds: string[]
) => {
  return (
    playerUserIds
      .map((userId) => {
        const lobbyActorId = getLobbyPlayerActorId(userId);
        const lobbyActor = actorManager.getActor(lobbyActorId) as
          | LobbyPlayerActor
          | undefined;
        return lobbyActor?.getSnapshot()?.matches('Ready');
      })
      .filter((val) => val).length === 0
  );
};

export type GameActor = ActorRefFrom<typeof gameMachine>;
export type GameState = StateFrom<typeof gameMachine>;

export type PartyMachine = ReturnType<typeof createPartyMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;
export type PartyState = StateFrom<PartyMachine>;
