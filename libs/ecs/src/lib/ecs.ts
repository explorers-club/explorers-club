// import {
//   Entity,
//   EntitySchema,
//   EntitySchemas,
//   SchemaType,
//   SnowflakeId,
// } from '@explorers-club/schema';
// import { AnyFunction, FromSubject } from '@explorers-club/utils';
// import { ArchetypeBucket, World } from 'miniplex';
// import { Observable, Subject } from 'rxjs';
// import { AnyStateMachine, interpret } from 'xstate';
// import { z } from 'zod';

// export const TICK_RATE = 60;
// export const EPOCH = new Date('January 1, 2023').getTime();

// export type FromArchetype<T extends ArchetypeBucket<any>> =
//   T extends ArchetypeBucket<infer U> ? U : never;

// export function getCurrentTick(): number {
//   const now = new Date();
//   const timeSinceEpoch = now.getTime() - EPOCH;
//   const tick = Math.floor(timeSinceEpoch / (1000 / TICK_RATE));
//   const tickDecimal = (timeSinceEpoch / (1000 / TICK_RATE)) % 1;
//   return parseFloat(`${tick}.${tickDecimal.toFixed(1).slice(2)}`);
// }

// const WORKER_ID_BITS = 10;
// const SEQUENCE_BITS = 12;

// const workerId = Math.floor(Math.random() * 2 ** WORKER_ID_BITS);
// let sequence = 0;
// let lastTimestamp = -1;

// export function generateSnowflakeId(): string {
//   let timestamp = Date.now() - EPOCH;
//   if (timestamp === lastTimestamp) {
//     sequence = (sequence + 1) % 2 ** SEQUENCE_BITS;
//     if (sequence === 0) {
//       // Sequence overflow, wait for next millisecond
//       timestamp++;
//       while (Date.now() - EPOCH <= timestamp) {
//         // Wait
//       }
//     }
//   } else {
//     sequence = 0;
//   }
//   lastTimestamp = timestamp;
//   const id =
//     (timestamp << (WORKER_ID_BITS + SEQUENCE_BITS)) |
//     (workerId << SEQUENCE_BITS) |
//     sequence;
//   return id.toString();
// }

// export const entitiesById = new Map<SnowflakeId, Entity>();

// type EntityProps<TEntity extends Entity> = Omit<
//   TEntity,
//   'id' | 'subscribe' | 'send' | 'states' | 'command' | 'context' | 'children'
// >;

// const ENTITY_BASE_PROPS = new Set<string | symbol>([
//   'id',
//   'subscribe',
//   'schema',
//   'send',
//   'states',
//   'command',
//   'context',
//   'children',
// ]);

// export const createEntity = <TEntity extends Entity>(
//   entityProps: EntityProps<TEntity>,
// ) => {
//   type PropNames = keyof TEntity;
//   type TCallback = Parameters<TEntity['subscribe']>[0];
//   type TEvent = Parameters<TCallback>[0];
//   type TCommand = Parameters<TEntity['send']>[0];

//   // if (entityProps.schema === "user") {

//   // }
//   // const schema = EntitySchemas[entityProps.schema];

//   const subscriptions = new Set<TCallback>();

//   const subscribe = (callback: TCallback) => {
//     subscriptions.add(callback);
//     return () => {
//       subscriptions.delete(callback);
//     };
//   };

//   const next = (event: TEvent) => {
//     for (const callback of subscriptions) {
//       callback(event as any); // todo fix TS not liking nested union types on event
//     }
//   };

//   const handler: ProxyHandler<TEntity> = {
//     set: (target, property, value) => {
//       if (ENTITY_BASE_PROPS.has(property)) {
//         return false;
//       }

//       // Check if the value is different from the current value
//       const prevValue = target[property as PropNames];
//       if (prevValue !== value) {
//         // Set the new value
//         target[property as PropNames] = value;

//         // Notify subscribers of the change
//         next({
//           type: 'CHANGE',
//           delta: {
//             property: property as PropNames,
//             value,
//             prevValue,
//           },
//         } as TEvent);
//       }
//       return true; // Indicate that the assignment was successful
//     },
//   };

//   const service = interpret(machine);
//   service.start();

//   const send = (command: TCommand) => {
//     next({
//       type: 'SEND_TRIGGER',
//       command,
//     } as any);

//     service.send(command);
//     entity.command = command;

//     next({
//       type: 'SEND_COMPLETE',
//       command,
//     } as any);
//   };

//   const entityBase = {
//     id: generateSnowflakeId(),
//     send,
//     subscribe,
//     children: [],
//     states: service.getSnapshot().value,
//   };

//   const entity: TEntity = {
//     ...entityBase,
//     ...entityProps,
//   } as unknown as TEntity; // todo fix hack, pretty sure this works though

//   const proxy = new Proxy(entity, handler);

//   entitiesById.set(entity.id, proxy);
//   return proxy;
// };

// type IndexFunction = (entity: Entity) => string;

// type IndexKey = string | string[] | IndexFunction;

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
//       return entity[key];
//     } else {
//       return key.map((keyComponent) => entity[keyComponent]).join('-');
//     }
//   };

//   const entitySubscriptionsMap = new Map<SnowflakeId, AnyFunction>();

//   world.onEntityAdded.add((entity) => {
//     if (entity.schema !== schemaType) {
//       return;
//     }

//     const key = getIndexKey(entity);
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

//     const key = getIndexKey(entity);
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

//   return [index, subject as Observable<FromSubject<typeof subject>>] as const;
// };

// /**
//  * Given a bucket and a prop name to use as an index key, returns back
//  * a tuple that includes a map of all the items in the index, indexed
//  * by the key, and an observable that emits events when a change on
//  * any entity happens
//  * @param bucket
//  * @param indexKey
//  * @returns
//  */
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

// // export const getEntity$ = <TEntity extends Entity>(id: SnowflakeId) => {
// //   const entity$ = entities$ById.get(id);
// //   entities$ById.get(id);
// //   if (!entity$) {
// //     throw new TRPCError({
// //       code: 'INTERNAL_SERVER_ERROR',
// //       message: "Couldn't find entity obesrvable " + id,
// //     });
// //   }
// //   return entity$ as Observable<EntityChangeEvent<TEntity>>;
// // };

// type EntityChangeDelta<TEntity extends Entity> = {
//   property: keyof TEntity;
//   value: TEntity[keyof TEntity];
//   prevValue: TEntity[keyof TEntity];
// };

// export interface EntityPropChangeEvent<TEntity extends Entity> {
//   type: 'CHANGE';
//   data: TEntity;
//   delta: EntityChangeDelta<TEntity>;
// }

// export type EntityIndexInitEvent<TEntity extends Entity> = {
//   type: 'INIT';
//   data: TEntity[];
// };

// export type EntityIndexAddEvent<TEntity extends Entity> = {
//   type: 'ADD';
//   data: TEntity;
// };

// export type EntityIndexRemoveEvent<TEntity extends Entity> = {
//   type: 'REMOVE';
//   data: TEntity;
// };

// export type EntityIndexEvent<TEntity extends Entity> =
//   | EntityPropChangeEvent<TEntity>
//   | EntityIndexInitEvent<TEntity>
//   | EntityIndexAddEvent<TEntity>
//   | EntityIndexRemoveEvent<TEntity>;

// export function isEntityPropChangeEvent<TEntity extends Entity>(
//   event: EntityIndexEvent<TEntity>
// ): event is EntityPropChangeEvent<TEntity> {
//   return event.type === 'CHANGE';
// }

// export function isEntitiesInitEvent<TEntity extends Entity>(
//   event: EntityIndexEvent<TEntity>
// ): event is EntityIndexInitEvent<TEntity> {
//   return event.type === 'INIT';
// }

// export function isEntityAddEvent<TEntity extends Entity>(
//   event: EntityIndexEvent<TEntity>
// ): event is EntityIndexAddEvent<TEntity> {
//   return event.type === 'ADD';
// }

// export function isEntityRemoveEvent<TEntity extends Entity>(
//   event: EntityIndexEvent<TEntity>
// ): event is EntityIndexRemoveEvent<TEntity> {
//   return event.type === 'REMOVE';
// }
