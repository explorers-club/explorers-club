import {
  Entity,
  EntityMachineMap,
  InitialEntityProps,
  SnowflakeId,
} from '@explorers-club/schema';
import { InterpreterFrom, interpret } from 'xstate';
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

const READONLY_ENTITY_PROPS = new Set<string | symbol>([
  'id',
  'subscribe',
  'send',
]);

// TODO update this to infer TEntity from
/**
 * Isomorphic function for creating an entity.
 * We need to dynamically register the machines on the client.
 * @param entityProps
 * @returns
 */
export const createEntity = <TEntity extends Entity>(
  entityProps: InitialEntityProps<TEntity>
) => {
  type PropNames = keyof TEntity;
  type TCallback = Parameters<TEntity['subscribe']>[0];
  type TEvent = Parameters<TCallback>[0];
  type TMachine = EntityMachineMap[typeof entityProps.schema]['machine'];
  type TInterpreter = InterpreterFrom<TMachine>;
  type TStateValue = TEntity['states'];
  type TCommand = Parameters<TEntity['send']>[0];

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

  // We wrap each non-primitive value in a proxy when it is accessed
  // and then store it in this map.
  const propertyProxyMap = new Map();

  const handler: ProxyHandler<TEntity> = {
    get(target, property) {
      if (property === 'context') {
        return service.getSnapshot().context;
      }

      if (property === 'states') {
        return service.getSnapshot().value;
      }

      // If there is already a proxy created for this property, use it
      const targetProxy = propertyProxyMap.get(property);
      if (targetProxy) {
        return targetProxy;
      }

      let value = target[property as PropNames];
      if (Array.isArray(value)) {
        value = new Proxy(value, {
          get(target, p: any) {
            switch (p) {
              case 'push':
                return (...args: any[]) => {
                  args.forEach((arg) => {
                    const index = target.length;

                    next({
                      type: 'CHANGE',
                      delta: {
                        type: 'ARRAY_ADD',
                        index: index,
                        value: arg,
                      },
                    } as TEvent);

                    Array.prototype.push.call(target, arg);
                  });

                  return target.length;
                };

              case 'pop':
                return () => {
                  if (target.length === 0) return undefined;

                  const index = target.length - 1;
                  const removedElement = target[index];

                  next({
                    type: 'CHANGE',
                    delta: {
                      type: 'ARRAY_REMOVE',
                      index: index,
                      value: removedElement,
                    },
                  } as TEvent);

                  return Array.prototype.pop.call(target);
                };

              case 'shift':
                return () => {
                  if (target.length === 0) return undefined;

                  const removedElement = target[0];

                  next({
                    type: 'CHANGE',
                    delta: {
                      type: 'ARRAY_REMOVE',
                      index: 0,
                      value: removedElement,
                    },
                  } as TEvent);

                  return Array.prototype.shift.call(target);
                };

              case 'unshift':
                return (...args: any[]) => {
                  args.forEach((arg, i) => {
                    next({
                      type: 'CHANGE',
                      delta: {
                        type: 'ARRAY_ADD',
                        index: i,
                        value: arg,
                      },
                    } as TEvent);
                  });

                  return Array.prototype.unshift.apply(target, args);
                };

              default:
                return target[p];
            }
          },
        });
        targetProxy.set(property, value);
      }
      // TODO also handle creating proxies for objects that can be mutated

      return value;
    },
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
            type: 'SET',
            property,
            value,
            prevValue,
          },
        } as TEvent);
        propertyProxyMap.delete(property);
      }

      return true; // Indicate that the assignment was successful
    },
  };

  const send = (command: TCommand) => {
    next({
      type: 'SEND_TRIGGER',
      command,
    } as any);

    entity.command = command;
    service.send(command);

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
    // children: [],
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
    proxy.states = state.value as TStateValue;
    next({
      type: 'TRANSITION',
    });
  });

  entitiesById.set(entity.id, proxy);
  return proxy;
};

// function createProxy<T extends object>(
//   entity: T,
//   callback: (event: ModificationEvent) => void
// ): T {
//   const handler: ProxyHandler<T> = {
//     get(target, prop, receiver) {
//       const val = Reflect.get(target, prop, receiver);
//       if (typeof val === 'function') {
//         return function (...args: any[]) {
//           if (Array.isArray(target) && prop === 'push') {
//             const index = target.length;
//             const value = args[0];
//             callback({ type: 'ARRAY_ADD', property: prop, index, value });
//           } else if (Array.isArray(target) && prop === 'pop') {
//             const index = target.length - 1;
//             const value = target[index];
//             callback({ type: 'ARRAY_REMOVE', property: prop, index, value });
//           } else if (target instanceof Set && prop === 'add') {
//             const value = args[0];
//             callback({ type: 'SET_ADD', property: prop, value });
//           } else if (target instanceof Set && prop === 'delete') {
//             const value = args[0];
//             callback({ type: 'SET_DELETE', property: prop, value });
//           } else if (target instanceof Map && prop === 'set') {
//             const key = args[0];
//             const value = args[1];
//             callback({ type: 'MAP_SET', property: prop, key, value });
//           } else if (target instanceof Map && prop === 'delete') {
//             const key = args[0];
//             callback({ type: 'MAP_DELETE', property: prop, key });
//           }
//           return Reflect.apply(val, target, args);
//         };
//       }
//       return val;
//     },
//     set(target, prop, value, receiver) {
//       callback({ type: 'OBJECT_SET', property: prop, value });
//       return Reflect.set(target, prop, value, receiver);
//     },
//     deleteProperty(target, prop) {
//       callback({ type: 'OBJECT_DELETE', property: prop });
//       return Reflect.deleteProperty(target, prop);
//     },
//   };
//   return new Proxy(entity, handler);
// }

// type EventCallback<T> = (event: T) => void;

// Define the createProxy function
// function createProxy<TEntityProps extends z.ZodRawShape>(
//   entity: TEntityProps,
//   entityPropsSchema: z.ZodObject<TEntityProps>,
//   callback: EventCallback<z.infer<ReturnType<typeof EntityPropChangeDeltaSchema>>>,
// ): TEntityProps {
//   // Create the schema for the events
//   const eventSchema = EntityPropChangeDeltaSchema(entityPropsSchema);

//   const handler: ProxyHandler<TEntityProps> = {
//     get(target, prop, receiver) {
//       const val = Reflect.get(target, prop, receiver);
//       if (typeof val === 'function') {
//         return function (...args: any[]) {
//           // Generate events based on the operation and use the eventSchema to validate them
//           if (Array.isArray(target) && prop === 'push') {
//             const index = target.length;
//             const value = args[0];
//             const event = eventSchema.parse({ type: 'ARRAY_ADD', property: prop, index, value });
//             callback(event);
//           } else if (Array.isArray(target) && prop === 'pop') {
//             const index = target.length - 1;
//             const value = target[index];
//             const event = eventSchema.parse({ type: 'ARRAY_REMOVE', property: prop, index, value });
//             callback(event);
//           } else if (target instanceof Set && prop === 'add') {
//             const value = args[0];
//             const event = eventSchema.parse({ type: 'SET_ADD', property: prop, value });
//             callback(event);
//           } else if (target instanceof Set && prop === 'delete') {
//             const value = args[0];
//             const event = eventSchema.parse({ type: 'SET_DELETE', property: prop, value });
//             callback(event);
//           } else if (target instanceof Map && prop === 'set') {
//             const key = args[0];
//             const value = args[1];
//             const event = eventSchema.parse({ type: 'MAP_SET', property: prop, key, value });
//             callback(event);
//           } else if (target instanceof Map && prop === 'delete') {
//             const key = args[0];
//             const event = eventSchema.parse({ type: 'MAP_DELETE', property: prop, key });
//             callback(event);
//           }
//           return Reflect.apply(val, target, args);
//         };
//       }
//       return val;
//     },
//     set(target, prop, value, receiver) {
//       const prevValue = target[prop];
//       const event = eventSchema.parse({ type: 'SET', property: prop, value, prevValue });
//       callback(event);
//       return Reflect.set(target, prop, value, receiver);
//     },
//     deleteProperty(target, prop) {
//       const event = eventSchema.parse({ type: 'OBJECT_DELETE', property: prop });
//       callback(event);
//       return Reflect.deleteProperty(target, prop);
//     },
//   };
//   return new Proxy(entity, handler);
// }
