import {
  ActorID,
  ActorManager,
  SharedMachineProps,
} from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import {
  getPartyPlayerActorId,
  PartyPlayerActor,
} from './party-player.machine';

export const PLAYER_JOINED = (props: { actorId: string }) => props;
export const PLAYER_LEFT = (props: { actorId: string }) => props;

export type PlayerJoinedEvent = ReturnType<typeof PLAYER_JOINED>;
export type PlayerLeftEvent = ReturnType<typeof PLAYER_LEFT>;

const gameMachine = createMachine({
  id: 'GameMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
  predictableActionArguments: true,
});

const partyModel = createModel(
  {
    playerActorIds: [] as ActorID[],
    actorManager: {} as ActorManager,
  },
  {
    events: {
      PLAYER_JOINED,
      PLAYER_LEFT,
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
        playerActorIds: [],
        actorManager,
      },
      initial: 'Lobby',
      on: {
        PLAYER_JOINED: {
          actions: partyModel.assign({
            playerActorIds: (context, { actorId }) => {
              return [...context.playerActorIds, actorId];
            },
          }),
        },
        PLAYER_LEFT: {
          actions: partyModel.assign({
            playerActorIds: (context, { actorId }) => {
              return context.playerActorIds.filter((id) => id !== actorId);
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
        allPlayersNotReady: ({ playerActorIds }) =>
          !getAllPlayersReady(actorManager, playerActorIds),
        // !getAllPlayersReady(actorManager, playerActorIds),
        allPlayersReady: ({ playerActorIds }) =>
          getAllPlayersReady(actorManager, playerActorIds),
        // getAllPlayersReady(actorManager, playerActorIds),
      },
    }
  );

const getAllPlayersReady = (
  actorManager: ActorManager,
  playerActorIds: string[]
) => {
  return (
    playerActorIds
      .map((userId) => {
        const actorId = getPartyPlayerActorId(userId);
        const actor = actorManager.getActor(actorId) as
          | PartyPlayerActor
          | undefined;
        return actor?.getSnapshot()?.matches('Ready');
      })
      .filter((val) => val).length === 0
  );
};

export type GameActor = ActorRefFrom<typeof gameMachine>;
export type GameState = StateFrom<typeof gameMachine>;

export type PartyMachine = ReturnType<typeof createPartyMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;
export type PartyState = StateFrom<PartyMachine>;
