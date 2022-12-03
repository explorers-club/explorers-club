/**
 * The shared collection machine runs on both client and server. It holds a reference to
 * all actors that live at some root path (e.g. party/bakery, game_instance/32zw9efj201...)
 *
 * It aims to remain generic and re-usable across different use cases.
 */
import { noop } from '@explorers-club/utils';
import { Database, get, onDisconnect, ref, set } from 'firebase/database';
import { from, map, Observable, skip } from 'rxjs';
import { fromRef, ListenEvent } from 'rxfire/database';
import {
  ActorRefFrom,
  AnyActorRef,
  AnyEventObject,
  AnyState,
  AnyStateMachine,
  assign,
  createMachine,
  interpret,
  spawn,
  State,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';
import { assertEventType, getActorType } from './helpers';
import { ActorID, ActorType } from './types';
import { saveActorEvent, saveActorState } from './db';

const sharedCollectionModel = createModel(
  {
    actorRefs: {} as Partial<Record<ActorID, AnyActorRef>>,
    rootPath: '' as string,
    myActorId: undefined as ActorID | undefined,
    db: {} as Database,
  },
  {
    events: {
      ACTOR_ADDED: (actorId: ActorID, stateJSON: string) => ({
        actorId,
        stateJSON,
      }),
      NEW_EVENT: (actorId: ActorID, event: AnyEventObject) => ({
        actorId,
        event,
      }),
      SPAWN<TContext>(actorId: ActorID, initialContext?: TContext) {
        return { actorId, initialContext };
      },
    },
  }
);

export type SharedCollectionContext = ModelContextFrom<
  typeof sharedCollectionModel
>;

export const SharedCollectionEvents = sharedCollectionModel.events;
export type SharedCollectionNewEventEvent = ReturnType<
  typeof SharedCollectionEvents.NEW_EVENT
>;
export type SharedCollectionActorAddedEvent = ReturnType<
  typeof SharedCollectionEvents.ACTOR_ADDED
>;

export interface SharedCollectionServices {
  /**
   * Returns an observable that emits each time any actor in the collection
   * logs an event in the database so that the actor running locally can update itself.
   */
  newEvent$: (
    context: SharedCollectionContext,
    event: SharedCollectionEvent
  ) => Observable<SharedCollectionNewEventEvent>;

  /**
   * Returns an observable that emits each time a new actor comes to exist
   * in the shared collection containing that actors current state
   */
  actorAdded$: (
    context: SharedCollectionContext,
    event: SharedCollectionEvent
  ) => Observable<SharedCollectionActorAddedEvent>;

  /**
   * Returns a promise that returns a map of all actors to their current JSON state
   * Used for when we are initializing the collection at startup.
   */
  fetchActors: (
    context: SharedCollectionContext
  ) => Promise<Record<ActorID, string>>;
}

// todo: typescript magic to infer this better automatically
export type FetchActorsDoneData = Awaited<
  ReturnType<SharedCollectionServices['fetchActors']>
>;
export type FetchActorsDoneEvent = {
  type: 'done.invoke.fetchActors';
  data: FetchActorsDoneData;
};

// Union model events with the done invoke events
export type SharedCollectionEvent =
  | ModelEventsFrom<typeof sharedCollectionModel>
  | FetchActorsDoneEvent;

type MachineMap = Partial<Record<ActorType, AnyStateMachine>>;

interface CreateProps {
  machines: MachineMap;
}

export const createSharedCollectionMachine = ({ machines }: CreateProps) => {
  return createMachine(
    {
      id: 'SharedCollectionMachine',
      type: 'parallel',
      schema: {
        context: {} as SharedCollectionContext,
        events: {} as SharedCollectionEvent,
      },
      states: {
        Events: {
          initial: 'Listening',
          states: {
            Listening: {
              invoke: {
                id: 'newEvent$',
                src: sharedCollectionServices.newEvent$,
              },
            },
          },
          on: {
            NEW_EVENT: {
              actions: 'sendEvent',
            },
          },
        },
        Actors: {
          initial: 'Loading',
          states: {
            Loading: {
              invoke: {
                id: 'fetchActors',
                src: sharedCollectionServices.fetchActors,
                onDone: {
                  target: 'Initialized',
                  actions: 'initializeActorRefs',
                },
              },
            },
            Initialized: {
              entry: 'initializeActorBroadcast',
              invoke: {
                id: 'actorAdded$',
                src: sharedCollectionServices.actorAdded$,
              },
              on: {
                ACTOR_ADDED: {
                  actions: 'hydrateActor',
                },
                SPAWN: {
                  actions: ['spawnActor', 'initializeActorBroadcast'],
                },
              },
            },
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        initializeActorRefs: assign<
          SharedCollectionContext,
          SharedCollectionEvent
        >({
          actorRefs: ({ myActorId }, event) => {
            assertEventType(event, 'done.invoke.fetchActors');
            const actorState = event.data as Partial<Record<ActorID, string>>;

            const actorRefs: Partial<Record<ActorID, AnyActorRef>> = {};
            Object.entries(actorState).forEach(([actorId, stateJSON]) => {
              const actorType = getActorType(actorId);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const state = JSON.parse(stateJSON!);
              const previousState = State.create(state);

              const machine = machines[actorType] as AnyStateMachine;
              if (!machine) {
                throw new Error('couldnt find machine for ' + actorType);
              }

              const execute = actorId === myActorId; // only run actions/services on our own actor
              const actor = interpret(machine, { execute }).start(
                previousState
              );
              actorRefs[actorId] = actor;
            });

            return actorRefs;
          },
        }),
        initializeActorBroadcast: ({ actorRefs, db, rootPath, myActorId }) => {
          const myActor = actorRefs[myActorId];
          if (!myActor) {
            return;
          }

          // log our events to firebase
          // skip the first once since that event should already exist
          const myEventRef = ref(db, `${rootPath}/actor_events/${myActorId}`);
          from(myActor)
            .pipe(skip(1))
            .subscribe((state) => {
              const event = JSON.parse(JSON.stringify(state.event));
              set(myEventRef, event).then(noop);
            });

          // Send disconnect event when we disconnect
          onDisconnect(myEventRef).set({ type: 'DISCONNECT' });
        },
        spawnActor: assign({
          actorRefs: ({ actorRefs, rootPath, db }, event) => {
            assertEventType(event, 'SPAWN');
            const { actorId, initialContext } = event;

            const actorType = getActorType(actorId);
            let machine = machines[actorType] as AnyStateMachine;
            if (!machine) {
              throw new Error('couldnt find machine for ' + actorType);
            }

            if (initialContext) {
              machine = machine.withContext(initialContext);
            }

            const actor = spawn(machine, actorId);

            saveActorState(db, rootPath, actorId, actor).then(noop);
            saveActorEvent(db, rootPath, actorId, actor).then(noop);

            return {
              ...actorRefs,
              [actorId]: actor,
            };
          },
        }),
        hydrateActor: assign({
          actorRefs: ({ actorRefs, myActorId }, event) => {
            assertEventType(event, 'ACTOR_ADDED');
            const { actorId, stateJSON } = event;

            // do nothing if already exists/hydrated
            if (actorId in actorRefs) {
              return actorRefs;
            }

            const actorType = getActorType(actorId);
            const state = JSON.parse(stateJSON) as AnyState;
            const previousState = State.create(state);

            const execute = actorId === myActorId; // only run actions/services on our own actor
            const machine = machines[actorType] as AnyStateMachine;
            if (!machine) {
              throw new Error('couldnt find machine for ' + actorType);
            }
            const actor = interpret(machine, { execute }).start(previousState);

            return {
              ...actorRefs,
              [actorId]: actor,
            };
          },
        }),
        sendEvent: ({ actorRefs }, event) => {
          assertEventType(event, 'NEW_EVENT');
          const { actorId } = event;

          const actor = actorRefs[actorId];
          if (!actor) {
            console.error(
              'tried to send actor event without actor present',
              actor,
              actorId
            );
            return;
          }

          actor.send(event.event);
        },
      },
    }
  );
};

export const sharedCollectionServices: SharedCollectionServices = {
  newEvent$({ db, rootPath }) {
    const eventsRef = ref(db, `${rootPath}/actor_events`);
    return fromRef(eventsRef, ListenEvent.changed).pipe(
      map((changes) => {
        const actorId = changes.snapshot.key;
        const event = changes.snapshot.val() as AnyEventObject;
        return SharedCollectionEvents.NEW_EVENT(actorId, event);
      })
    );
  },

  actorAdded$({ db, rootPath }) {
    const stateRef = ref(db, `${rootPath}/actor_state`);
    return fromRef(stateRef, ListenEvent.added).pipe(
      map((changes) => {
        const actorId = changes.snapshot.key;
        const stateJSON = changes.snapshot.val();

        // TODO there's probably a bug here where we are triggering events
        // on rejoin where we shouldnt be

        return SharedCollectionEvents.ACTOR_ADDED(actorId, stateJSON);
      })
    );
  },

  async fetchActors({ db, rootPath }) {
    const stateRef = ref(db, `${rootPath}/actor_state`);
    const actorStateSnapshot = await get(stateRef);
    return (actorStateSnapshot.val() || {}) as Partial<Record<ActorID, string>>;
  },
};

export type SharedCollectionMachine = ReturnType<
  typeof createSharedCollectionMachine
>;
export type SharedCollectionActor = ActorRefFrom<SharedCollectionMachine>;
export type SharedCollectionState = StateFrom<SharedCollectionMachine>;
