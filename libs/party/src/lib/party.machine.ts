import {
  ActorID,
  ActorManager,
  fromActorEvents,
  SharedMachineProps,
} from '@explorers-club/actor';
import { filter, first } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { PartyPlayerActor } from './party-player.machine';

const MIN_PLAYER_COUNT = 2;

// TODO import this...
// For now we can hard code the game machien since we only have one
// But in future probalby want that to be dynamic
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
    startingAt: undefined as Date | undefined,
  },
  {
    events: {
      PLAYER_JOINED: (props: { actorId: string }) => props,
      PLAYER_LEFT: (props: { actorId: string }) => props,
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
        startingAt: undefined,
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
              invoke: {
                src: 'onAllPlayersReady',
                onDone: 'AllReady',
              },
            },
            AllReady: {
              invoke: {
                src: 'onAnyPlayerNotReady',
                onDone: 'Waiting',
              },
              after: {
                5000: 'EnteringGame',
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
      actions: {
        setStartingAtTime: partyModel.assign({
          startingAt: () => {
            const now = new Date();
            now.setSeconds(now.getSeconds() + 6);
            return now;
          },
        }),
      },
      services: {
        onAnyPlayerNotReady: () =>
          new Promise((resolve) => {
            const playerEvents$ = fromActorEvents(actorManager, [
              'PLAYER_JOINED',
              'PLAYER_LEFT',
              'PLAYER_READY',
              'PLAYER_UNREADY',
            ]);
            playerEvents$
              .pipe(
                first() // Take the first
              )
              .subscribe(resolve);
          }),
        onAllPlayersReady: () =>
          new Promise((resolve) => {
            const playerEvents$ = fromActorEvents(actorManager, [
              'PLAYER_JOINED',
              'PLAYER_LEFT',
              'PLAYER_READY',
              'PLAYER_UNREADY',
            ]);
            playerEvents$
              .pipe(
                filter(() => {
                  const partyActor = actorManager.rootActor as PartyActor;
                  const playerActors = actorManager.getActorsForType(
                    'PLAYER_ACTOR'
                  ) as PartyPlayerActor[];
                  const readyCount = playerActors
                    .map((actor) => actor.getSnapshot()?.matches('Ready.Yes'))
                    .filter((isReady) => isReady).length;
                  const playerCount =
                    partyActor.getSnapshot()?.context.playerActorIds.length ||
                    0;

                  const allReady = readyCount === playerCount;
                  const minReady = playerCount >= MIN_PLAYER_COUNT;

                  return allReady && minReady;
                }),
                first()
              )
              .subscribe(resolve);
          }),
      },
    }
  );

export type GameActor = ActorRefFrom<typeof gameMachine>;
export type GameState = StateFrom<typeof gameMachine>;

export type PartyMachine = ReturnType<typeof createPartyMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;
export type PartyState = StateFrom<PartyMachine>;
