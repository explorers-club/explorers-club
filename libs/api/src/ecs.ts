import { Entity, EntityMachineMap, SnowflakeId } from '@explorers-club/schema';
import { interpret, InterpreterFrom } from 'xstate';
import { EPOCH, TICK_RATE } from './ecs.constants';
import { machineMap } from './machines';
import { world } from './world';

export function getCurrentTick(): number {
  const now = new Date();
  const timeSinceEpoch = now.getTime() - EPOCH;
  const tick = Math.floor(timeSinceEpoch / (1000 / TICK_RATE));
  const tickDecimal = (timeSinceEpoch / (1000 / TICK_RATE)) % 1;
  return parseFloat(`${tick}.${tickDecimal.toFixed(1).slice(2)}`);
}

const WORKER_ID_BITS = 10;
const SEQUENCE_BITS = 12;

const workerId = Math.floor(Math.random() * 2 ** WORKER_ID_BITS);
let sequence = 0;
let lastTimestamp = -1;

export function generateSnowflakeId(): string {
  let timestamp = Date.now() - EPOCH;
  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) % 2 ** SEQUENCE_BITS;
    if (sequence === 0) {
      // Sequence overflow, wait for next millisecond
      timestamp++;
      while (Date.now() - EPOCH <= timestamp) {
        // Wait
      }
    }
  } else {
    sequence = 0;
  }
  lastTimestamp = timestamp;
  const id =
    (timestamp << (WORKER_ID_BITS + SEQUENCE_BITS)) |
    (workerId << SEQUENCE_BITS) |
    sequence;
  return id.toString();
}

export const entitiesById = new Map<SnowflakeId, Entity>();

type EntityProps<TEntity extends Entity> = Omit<
  TEntity,
  'id' | 'subscribe' | 'send' | 'states' | 'command' | 'context' | 'children'
>;

const READONLY_ENTITY_PROPS = new Set<string | symbol>([
  'id',
  'subscribe',
  'send',
]);

export const createEntity = <TEntity extends Entity>(
  entityProps: EntityProps<TEntity>
) => {
  type PropNames = keyof TEntity;
  type TCallback = Parameters<TEntity['subscribe']>[0];
  type TEvent = Parameters<TCallback>[0];
  type TMachine = EntityMachineMap[typeof entityProps.schema]['machine'];
  type TInterpreter = InterpreterFrom<TMachine>;
  type TStateValue = TEntity['states'];
  type TCommand = Parameters<TEntity['send']>[0];
  //   type TMatches = TEntity['matches'];
  //   type TState = State<TContext, TCommand, TStateSchemaxtends StateSchema<any>>;
  //   type TState = StateFrom<TMachine>;
  //   type TContext = ContextFrom<TMachine>;
  //   type TState = StateValueFrom<TMachine>;
  //   type TMachine = EntityMachine<typeof entityProps.schema>;

  const subscriptions = new Set<TCallback>();

  const subscribe = (callback: TCallback) => {
    subscriptions.add(callback);
    return () => {
      subscriptions.delete(callback);
    };
  };

  const next = (event: TEvent) => {
    for (const callback of subscriptions) {
      callback(event as any); // todo fix TS not liking nested union types on event
    }
  };

  const handler: ProxyHandler<TEntity> = {
    set: (target, property, value) => {
      if (READONLY_ENTITY_PROPS.has(property)) {
        return true;
      }

      // Check if the value is different from the current value
      const prevValue = target[property as PropNames];
      if (prevValue !== value) {
        // Set the new value
        target[property as PropNames] = value;

        // Notify subscribers of the change
        next({
          type: 'CHANGE',
          delta: {
            property: property as PropNames,
            value,
            prevValue,
          },
        } as TEvent);
      }
      return true; // Indicate that the assignment was successful
    },
  };

  const send = (command: TCommand) => {
    next({
      type: 'SEND_TRIGGER',
      command,
    } as any);

    service.send(command);
    entity.command = command;
    entity.states = service.getSnapshot().value as TStateValue;
    // console.log(entity);

    next({
      type: 'SEND_COMPLETE',
      command,
    } as any);
  };

  //   const matches = (params: TMatchParams) =>
  //     service.getSnapshot().matches(params);

  const entityBase = {
    id: generateSnowflakeId(),
    send,
    subscribe,
    children: [],
    //     states: service.getSnapshot().value,
  };

  const entity: TEntity = {
    ...entityBase,
    ...entityProps,
  } as unknown as TEntity; // todo fix hack, pretty sure this works though

  const proxy = new Proxy(entity, handler);
  const machine = machineMap[entityProps.schema]({
    world,
    entity: proxy,
  });
  // todo fix types
  const service = interpret(machine as any) as unknown as TInterpreter;
  service.start();
  service.onTransition((state) => {
    entity.states = state.value as any;
    next({
      type: 'TRANSITION',
    });
  });
  proxy.states = service.getSnapshot().value as TStateValue;

  entitiesById.set(entity.id, proxy);
  return proxy;
};

// export const createSchemaIndex = <TKey extends IndexKey>(
//   world: World<Entity>,
//   schemaType: SchemaType,
//   key: TKey
// ) => {
//   const schema = EntitySchemas[schemaType];
//   type TEntity = z.infer<typeof schema>;

//   const index = new Map<string, TEntity>();
//   const subject = new Subject<EntityIndexEvent<TEntity>>();

//   const getIndexKey = (entity: TEntity) => {
//     if (typeof key === 'function') {
//       return key(entity);
//     } else if (typeof key === 'string') {
//       return entity[key as keyof TEntity];
//     } else {
//       return key.map((keyComponent) => entity[keyComponent as keyof TEntity]).join('-');
//     }
//   };

//   const entitySubscriptionsMap = new Map<SnowflakeId, AnyFunction>();

//   world.onEntityAdded.add((entity) => {
//     if (entity.schema !== schemaType) {
//       return;
//     }

//     const key = getIndexKey(entity) as string;
//     if (index.has(key)) {
//       console.warn('index received duplicate key igorning', key);
//       return;
//     }

//     index.set(key, entity);
//     subject.next({
//       type: 'ADD',
//       data: entity,
//     });

//     const entitySubscription = entity.subscribe((event) => {
//       if (event.type === 'CHANGE') {
//         subject.next({
//           type: 'CHANGE',
//           data: entity,
//           delta: event.delta as EntityChangeDelta<TEntity>,
//         });
//       }
//     });

//     entitySubscriptionsMap.set(entity.id, entitySubscription);
//   });

//   world.onEntityRemoved.add((entity) => {
//     if (entity.schema !== schemaType) {
//       return;
//     }

//     const key = getIndexKey(entity) as string;
//     index.delete(key);

//     const entitySubscription = entitySubscriptionsMap.get(entity.id);
//     if (entitySubscription) {
//       entitySubscription();
//     } else {
//       console.warn(
//         "expected entity subscritption but didn't find one for ",
//         entity.id
//       );
//     }

//     subject.next({
//       type: 'REMOVE',
//       data: entity,
//     });
//   });

//   subject.next({
//     type: 'INIT',
//     data: world.entities, // todo filter for access
//   });

//   return [index, subject as Observable<FromSubject<typeof subject>>] as const;
// };

/**
 * Given a bucket and a prop name to use as an index key, returns back
 * a tuple that includes a map of all the items in the index, indexed
 * by the key, and an observable that emits events when a change on
 * any entity happens
 * @param bucket
 * @param indexKey
 * @returns
 */
// export const createArchetypeIndex = <TEntity extends Entity>(
//   bucket: ArchetypeBucket<TEntity>,
//   indexKey: keyof TEntity | ((data: TEntity) => string)
// ) => {
//   type BucketEntity = FromArchetype<typeof bucket>;
//   const index = new Map<string, BucketEntity>();
//   const subject = new Subject<EntityIndexEvent<TEntity>>();

//   const getKey = (entity: TEntity) => {
//     if (typeof indexKey === 'function') {
//       return indexKey(entity) as string;
//     } else {
//       return entity[indexKey] as string;
//     }
//   };

//   for (const entity of bucket) {
//     const key = getKey(entity);
//     index.set(key, entity);
//   }

//   subject.next({
//     type: 'INIT',
//     data: bucket.entities,
//   });

//   const entitySubscriptionsMap = new Map<SnowflakeId, AnyFunction>();

//   bucket.onEntityAdded.add((entity) => {
//     const key = getKey(entity);
//     if (index.has(key)) {
//       console.warn('index received duplicate key. igorning', key);
//     }

//     index.set(key, entity);
//     subject.next({
//       type: 'ADD',
//       data: entity,
//     });

//     const entitySubscription = entity.subscribe((event) => {
//       if (event.type === 'CHANGE') {
//         subject.next({
//           type: 'CHANGE',
//           data: entity,
//           delta: event.delta as EntityChangeDelta<TEntity>,
//         });
//       }
//     });

//     entitySubscriptionsMap.set(entity.id, entitySubscription);
//   });

//   bucket.onEntityRemoved.add((entity) => {
//     const key = getKey(entity);
//     index.delete(key);

//     const entitySubscription = entitySubscriptionsMap.get(entity.id);
//     if (entitySubscription) {
//       entitySubscription(); //
//     } else {
//       console.warn(
//         "expected entity subscritption but didn't find one for ",
//         entity.id
//       );
//     }

//     subject.next({
//       type: 'REMOVE',
//       data: entity,
//     });
//   });

//   return [index, subject as Observable<FromSubject<typeof subject>>] as const;
// };

// export const getEntity$ = <TEntity extends Entity>(id: SnowflakeId) => {
//   const entity$ = entities$ById.get(id);
//   entities$ById.get(id);
//   if (!entity$) {
//     throw new TRPCError({
//       code: 'INTERNAL_SERVER_ERROR',
//       message: "Couldn't find entity obesrvable " + id,
//     });
//   }
//   return entity$ as Observable<EntityChangeEvent<TEntity>>;
// };
