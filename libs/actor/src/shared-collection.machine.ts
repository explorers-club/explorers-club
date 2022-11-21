/**
 * The shared collection machine runs on both client and server. It holds a reference to
 * all actors that live at some root path (e.g. party/bakery, game_instance/32zw9efj201...)
 *
 * It aims to remain generic and re-usable across different use cases.
 */
import { noop } from '@explorers-club/utils';
import { Database, get, ref, set } from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { map } from 'rxjs';
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
  StateFrom
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';
import { assertEventType, getActorType } from './helpers';
import { ActorID, ActorType, SharedMachineProps } from './types';

const sharedCollectionModel = createModel(
  {
    actorRefs: {} as Partial<Record<ActorID, AnyActorRef>>,
  },
  {
    events: {
      HYDRATE: (actorId: ActorID, stateJSON: string) => ({
        actorId,
        stateJSON,
      }),
      SPAWN: (actorId: ActorID) => ({
        actorId,
      }),
      SEND_EVENT: (actorId: ActorID, event: AnyEventObject) => ({
        actorId,
        event,
      }),
    },
  }
);

export const SharedCollectionEvents = sharedCollectionModel.events;

type SharedCollectionEvent = ModelEventsFrom<typeof sharedCollectionModel>;
type SharedCollectionContext = ModelContextFrom<typeof sharedCollectionModel>;

interface CreateProps {
  rootPath: string; // e.g. 'lobby/bakery'
  db: Database;
  getCreateMachine: (
    actorType: ActorType
  ) => (props: SharedMachineProps) => AnyStateMachine;
}

export const createSharedCollectionMachine = ({
  db,
  rootPath,
  getCreateMachine,
}: CreateProps) => {
  const eventsRef = ref(db, `${rootPath}/actor_events`);
  const stateRef = ref(db, `${rootPath}/actor_state`);

  // Listens for event writes in firebase and emits
  // a HYDRATE on the share machine
  const hydrateActors$ = fromRef(stateRef, ListenEvent.added).pipe(
    map((changes) => {
      // const actors: AnyActorRef[] = [];

      const actorId = changes.snapshot.key;
      const stateJSON = changes.snapshot.val();

      // TODO there's probably a bug here where we are triggering events
      // on rejoin where we shouldnt be
      // console.log({ changes, val });
      // const actors = changes.map((change) => {
      //   const actorId = change.snapshot.key;
      //   const stateJSON = change.snapshot.val();
      //   return { actorId, stateJSON };
      // });

      return { type: 'HYDRATE', actorId, stateJSON };
    })
  );

  // Listens for event writes in firebase and emits
  // a SEND_EVENT on the share machine
  //
  // It assumes that the ref is created first before the first
  // true "write" happens for an actor, because this firebase listener
  // only emits "changes" to children, not "new" children
  const newEvent$ = fromRef(eventsRef, ListenEvent.changed).pipe(
    map((changes) => {
      const { actorId, event } = changes.snapshot.val() as {
        actorId: ActorID;
        event: AnyEventObject;
      };
      return { type: 'SEND_EVENT', actorId, event };
    })
  );

  return createMachine<SharedCollectionContext, SharedCollectionEvent>(
    {
      id: 'SharedCollectionMachine',
      type: 'parallel',
      context: {
        actorRefs: {},
      },
      states: {
        Events: {
          initial: 'Listening',
          states: {
            Listening: {
              invoke: {
                src: () => newEvent$,
              },
            },
          },
          on: {
            SEND_EVENT: {
              actions: 'sendEvent',
            },
          },
        },
        Actors: {
          initial: 'Loading',
          states: {
            Loading: {
              invoke: {
                src: 'fetchActors',
                onDone: {
                  target: 'Initialized',
                  actions: assign({
                    actorRefs: (_, event) => {
                      const actorState = event.data as Partial<
                        Record<ActorID, string>
                      >;

                      const actorRefs: Partial<Record<ActorID, AnyActorRef>> =
                        {};
                      Object.entries(actorState).forEach(
                        ([actorId, stateJSON]) => {
                          const actorType = getActorType(actorId);
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          const state = JSON.parse(stateJSON!);
                          const previousState = State.create(state);

                          const createMachine = getCreateMachine(actorType);
                          const machine = createMachine({ actorId });
                          const actor = interpret(machine).start(previousState);
                          actorRefs[actorId] = actor;
                        }
                      );

                      return actorRefs;
                    },
                  }),
                },
              },
            },
            Initialized: {
              invoke: {
                src: () => hydrateActors$,
              },
              on: {
                HYDRATE: {
                  actions: 'hydrateActors',
                },
                SPAWN: {
                  actions: 'spawnActor',
                },
              },
            },
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      services: {
        fetchActors: async () => {
          const actorStateSnapshot = await get(stateRef);
          return (actorStateSnapshot.val() || {}) as Partial<
            Record<ActorID, string>
          >;
        },
      },
      actions: {
        spawnActor: assign({
          actorRefs: ({ actorRefs }, event) => {
            assertEventType(event, 'SPAWN');
            const { actorId } = event;

            const actorType = getActorType(actorId);
            const createMachine = getCreateMachine(actorType);
            const machine = createMachine({
              actorId,
            });

            const actor = spawn(machine, actorId);

            const myStateRef = ref(db, `${rootPath}/actor_state/${actorId}`);
            const myEventRef = ref(db, `${rootPath}/actor_events/${actorId}`);

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const state = actor.getSnapshot()!;
            const stateJSON = JSON.stringify(state);

            set(myStateRef, stateJSON).then(noop); // todo handle error
            set(myEventRef, state.event).then(noop);

            return {
              ...actorRefs,
              [actorId]: actor,
            };
          },
        }),
        hydrateActors: assign({
          actorRefs: ({ actorRefs }, event) => {
            assertEventType(event, 'HYDRATE');
            const { actorId, stateJSON } = event;

            // do nothing if already exists/hydrated
            if (actorId in actorRefs) {
              return actorRefs;
            }

            const actorType = getActorType(actorId);
            const createMachine = getCreateMachine(actorType);
            const machine = createMachine({
              actorId,
            });
            const state = JSON.parse(stateJSON) as AnyState;
            const previousState = State.create(state);

            const actor = interpret(machine).start(previousState);

            return {
              ...actorRefs,
              [actorId]: actor,
            };
          },
        }),
        sendEvent: ({ actorRefs }, event) => {
          assertEventType(event, 'SEND_EVENT');
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

export type SharedCollectionMachine = ReturnType<
  typeof createSharedCollectionMachine
>;
export type SharedCollectionActor = ActorRefFrom<SharedCollectionMachine>;
export type SharedCollectionState = StateFrom<SharedCollectionMachine>;
