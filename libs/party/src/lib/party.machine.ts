import {
  ActorID,
  ActorManager,
  ActorType,
  fromActorEvents,
  ManagedActor,
  SharedMachineProps,
} from '@explorers-club/actor';
import { filter, first, fromEvent, take } from 'rxjs';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { PartyPlayerActor } from './party-player.machine';

const MIN_PLAYER_COUNT = 2;

const partyModel = createModel(
  {
    playerActorIds: [] as ActorID[],
    hostActorId: '' as ActorID,
    actorManager: {} as ActorManager,
    startingAt: undefined as Date | undefined,
    gameActorId: undefined as ActorID | undefined,
  },
  {
    events: {
      PLAYER_JOINED: (props: { actorId: string }) => props,
      PLAYER_LEFT: (props: { actorId: string }) => props,
      PLAYER_REMOVE: (props: { actorId: string }) => props,
    },
  }
);

export const PartyEvents = partyModel.events;

export const createPartyMachine = ({
  actorId,
  actorManager,
}: SharedMachineProps) =>
  partyModel.createMachine(
    {
      id: actorId,
      context: {
        playerActorIds: [],
        hostActorId: '',
        actorManager,
        startingAt: undefined,
        gameActorId: undefined,
      },
      initial: 'Lobby',
      on: {
        PLAYER_JOINED: {
          actions: partyModel.assign({
            playerActorIds: (context, { actorId }) => {
              return [...context.playerActorIds, actorId];
            },
            hostActorId: (context, { actorId }) => {
              // The first actor to join we set as the host
              // if one isnt set
              if (!context.hostActorId) {
                return actorId;
              } else {
                return context.hostActorId;
              }
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
                5000: 'CreatingGame',
              },
            },
            CreatingGame: {
              invoke: {
                src: 'onSpawnGameActor',
                onDone: 'EnteringGame',
              },
            },
            EnteringGame: {
              type: 'final' as const,
            },
          },
        },
        Game: {
          initial: 'Initializing',
          entry: () => {
            // todo make a getActorForType which returns the first
            console.log(
              'game initializing',
              actorManager.getActorsForType(ActorType.TREEHOUSE_TRIVIA_ACTOR)
            );
          },
          states: {
            Initializing: {},
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
        onSpawnGameActor: () =>
          new Promise((resolve) => {
            const spawn$ = fromEvent<ManagedActor>(actorManager, 'SPAWN');
            spawn$
              .pipe(
                filter((e) => e.actorType === ActorType.TREEHOUSE_TRIVIA_ACTOR),
                first()
              )
              .subscribe(resolve);
          }),

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
                    ActorType.PLAYER_ACTOR
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

export type PartyMachine = ReturnType<typeof createPartyMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;
export type PartyState = StateFrom<PartyMachine>;
