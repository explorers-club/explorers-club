import {
  ActorType,
  getActorId,
  selectActorsInitialized,
  selectMyActor,
  SharedCollectionActor,
  SharedCollectionEvents
} from '@explorers-club/actor';
import { createSelector } from 'reselect';
import { filter, firstValueFrom, from, take } from 'rxjs';
import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { DiffusionaryPlayerActor } from './state/diffusionary-player.machine';

const mainModel = createModel(
  {
    sharedCollectionActor: {} as SharedCollectionActor,
    userId: undefined as string | undefined,
  },
  {
    events: {
      CONTINUE: () => ({}),
    },
  }
);

export const MainEvents = mainModel.events;
export type MainContext = ContextFrom<typeof mainModel>;
export type MainEvent = EventFrom<typeof mainModel>;

export const mainMachine = createMachine(
  {
    id: 'MainMachine',
    initial: 'Initializing',
    schema: {
      context: {} as MainContext,
      events: {} as MainEvent,
    },
    states: {
      Initializing: {
        invoke: {
          src: async ({ sharedCollectionActor }) => {
            waitFor(sharedCollectionActor, selectActorsInitialized);
          },
        },
        always: [
          {
            target: 'SpawningActor',
            cond: 'hasNoActor',
          },
          {
            target: 'EnteringName',
            cond: 'hasNoName',
          },
          {
            target: 'Playing',
          },
        ],
      },
      SpawningActor: {
        invoke: {
          src: async ({ sharedCollectionActor, userId }) => {
            if (!userId) {
              throw new Error('tried to spawn actor without userId set');
            }
            sharedCollectionActor.send(
              SharedCollectionEvents.SPAWN(
                getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, userId),
                {
                  playerName: undefined,
                }
              )
            );

            const selectActorIsInitialized = createSelector(
              selectMyActor<DiffusionaryPlayerActor>,
              (actor) => !!actor
            );
            console.log('spawning');
            await waitFor(sharedCollectionActor, selectActorIsInitialized);
            console.log('SPAWNED!');
          },
          onDone: 'Playing',
        },
      },
      EnteringName: {
        invoke: {
          src: async ({ sharedCollectionActor, userId }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const actor = selectMyActor<DiffusionaryPlayerActor>(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sharedCollectionActor.getSnapshot()!
            )!;
            console.log(actor);

            const onSetPlayerName$ = from(actor).pipe(
              filter((state) => !!state.context.playerName),
              take(1)
            );
            return await firstValueFrom(onSetPlayerName$);
          },
          onDone: 'Playing',
        },
      },
      Playing: {},
    },
  },
  {
    guards: {
      hasNoActor: ({ sharedCollectionActor }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return !selectMyActor(sharedCollectionActor.getSnapshot()!);
      },
      hasNoName: ({ sharedCollectionActor }) => {
        const myActor = selectMyActor<DiffusionaryPlayerActor>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sharedCollectionActor.getSnapshot()!
        );
        return !myActor?.getSnapshot()?.context.playerName;
      },
    },
  }
);

export type MainMachine = typeof mainMachine;
export type MainActor = ActorRefFrom<MainMachine>;
export type MainState = StateFrom<MainMachine>;
