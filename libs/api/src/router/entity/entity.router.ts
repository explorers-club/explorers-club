import { EntityPropsSchema } from '@explorers-club/schema';
import { protectedProcedure, publicProcedure, router } from '../../trpc';
import { generateSnowflakeId } from '../../ecs';
import { world } from '../../world';

export const entityRouter = router({
  // create: protectedProcedure.input(EntityPropsSchema).mutation(({ input }) => {
  //   // TODO check that we have permission to do it
  //   // const entity = createEntity(input);
  //   const entity = {
  //     id: generateSnowflakeId(),
  //     ...input,
  //   };
  //   world.add(entity);
  // }),
  list: publicProcedure.subscription(({ ctx }) => {
    // Track if entities get removed
    const myEntities = new Map<SnowflakeId, Entity>();
    const myEntitySubscriptions = new Map<SnowflakeId, AnyFunction>();
    const addedIds = new Set<SnowflakeId>();
    const changedIds = new Set<SnowflakeId>();
    const removedIds = new Set<SnowflakeId>();
    // const entityDeltas = new Map<SnowflakeId, EntityDelta[]>();
    // const changedProps = new Map<SnowflakeId, Set<EntityDataKey>>();

    for (const entity of world.entities) {
      if (hasAccess(entity, ctx.connectionEntity)) {
        myEntities.set(entity.id, entity);
        addedIds.add(entity.id);
      }
    }

    const unsubscribeOnAdd = world.onEntityAdded.add((entity) => {
      const nowHasAccess = hasAccess(entity, ctx.connectionEntity);
      if (nowHasAccess) {
        myEntities.set(entity.id, entity);
        addedIds.add(entity.id);
      }

      // TODO cleanup these subscriptions
      const unsub = entity.subscribe((event) => {
        if (event.type === 'CHANGE') {
          const previousHasAccess = myEntities.has(entity.id);
          const nowHasAccess = hasAccess(entity, ctx.connectionEntity);
          if (!previousHasAccess && nowHasAccess) {
            myEntities.set(entity.id, entity);
            addedIds.add(entity.id);
            removedIds.delete(entity.id); // in case case we previously removed it but it wasnt flushed
          } else if (previousHasAccess && !nowHasAccess) {
            myEntities.delete(entity.id);
            removedIds.add(entity.id);
            addedIds.delete(entity.id); // in case case we previously removed it but it wasnt flushed
          }

          let deltas = entityDeltas.get(entity.id);
          if (!deltas) {
            deltas = [];
            entityDeltas.set(entity.id, deltas);
          }
          deltas.push(event.delta);
          changedIds.add(entity.id);
        }
      });
      myEntitySubscriptions.set(entity.id, unsub);
    });

    const unsubscribeOnRemove = world.onEntityRemoved.add((entity) => {
      const previousHasAccess = myEntities.has(entity.id);
      if (previousHasAccess) {
        removedIds.add(entity.id);
      }

      const unsub = myEntitySubscriptions.get(entity.id);
      if (unsub) {
        unsub();
      }
    });

    // baseEntityIndex$.subscribe((event) => {
    //   if (event.type === 'ADD' || event.type === 'REMOVE') {
    //     const entity = event.data;

    //     const previousHasAccess = myEntities.has(entity.id);
    //     const nowHasAccess = hasAccess(entity, ctx.connectionEntity);

    //     if (nowHasAccess) {
    //       myEntities.set(entity.id, entity);
    //     } else {
    //       myEntities.delete(entity.id);
    //     }

    //     if (previousHasAccess && !nowHasAccess) {
    //       removedIds.add(entity.id);

    //       // Unsubscribe from updates
    //       const sub = myEntitySubscriptions.get(entity.id);
    //       if (sub) {
    //         sub();
    //       }
    //     } else if (!previousHasAccess && nowHasAccess) {
    //       addedIds.add(entity.id);
    //     }
    //   } else if (event.type === 'CHANGE') {
    //     const entityId = event.data.id;

    //     if (myEntities.has(entityId)) {
    //       let changedPropsSet = changedProps.get(entityId);
    //       if (!changedPropsSet) {
    //         changedPropsSet = new Set();
    //         changedProps.set(entityId, changedPropsSet);
    //       }
    //       // TODO store the full delta
    //       changedPropsSet.add(event.delta.property);
    //       changedIds.add(entityId);
    //     }
    //   }
    // });

    const flush = (emit: Observer<EntityListEvent, unknown>) => {
      if (addedIds.size || removedIds.size || changedIds.size) {
        const addedEntities = Array.from(addedIds).map(
          (id) => myEntities.get(id)!
        );
        const removedEntities = Array.from(removedIds).map(
          (id) => myEntities.get(id)!
        );

        const changedEntities = Array.from(changedIds).map((id) => {
          const deltas = entityDeltas.get(id)!;
          return {
            id,
            deltas,
          };
        });

        emit.next({
          addedEntities: addedEntities.map(removeFunctions),
          removedEntities: removedEntities.map(removeFunctions),
          changedEntities,
        });

        addedIds.clear();
        removedIds.clear();

        for (const id in changedIds) {
          entityDeltas.get(id)!.length = 0;
        }
        changedIds.clear();
      }
    };

    return observable<EntityListEvent>((emit) => {
      // Send the initiale entities..
      flush(emit);

      // Every tick, check to see if entities were added or removed
      // If they were, flush them, then clear out the sets for tracking
      const event$ = from(interval(1000 / TICK_RATE)).subscribe(() => {
        flush(emit);
      });

      return () => {
        event$.unsubscribe();
        unsubscribeOnAdd();
        unsubscribeOnRemove();
      };
    });
  }),
});

// // import { createArchetypeIndex, TICK_RATE } from '../../ecs';
// import {
//   ConnectionEntity,
//   Entity,
//   EntityPropsSchema,
//   SnowflakeId,
//   SyncedEntityProps,
// } from '@explorers-club/schema';
// import { AnyFunction } from '@explorers-club/utils';
// import { Observer, observable } from '@trpc/server/observable';
// import { from, interval } from 'rxjs';
// import { TICK_RATE } from '../../ecs.constants';
// // import { createArchetypeIndex } from '../../indices';
// import { Patch } from 'immer';
// import { createEntity } from '../../ecs';
// import { protectedProcedure, publicProcedure, router } from '../../trpc';
// import { world } from '../../world';

// type NonFunctionKeys<T> = {
//   [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
// }[keyof T];

// type OmitFunctions<T> = Pick<T, NonFunctionKeys<T>>;

// function isNonFunctionKey<T>(key: keyof T, obj: T): key is NonFunctionKeys<T> {
//   return typeof obj[key] !== 'function';
// }

// function removeFunctions<T>(obj: T): OmitFunctions<T> {
//   const result = {} as OmitFunctions<T>;

//   for (const key in obj) {
//     console.log(key);
//     console.log(obj[key]);
//     if (isNonFunctionKey(key, obj)) {
//       result[key] = obj[key];
//     }
//   }

//   return result;
// }

// // const [baseEntityIndex, baseEntityIndex$] = createArchetypeIndex(
// //   world.with('id', 'schema'),
// //   'id'
// // );

// // type ChangedEntityProps = Partial<SyncedEntityProps<Entity>> & {
// //   id: SnowflakeId;
// // };

// type EntityListEvent = {
//   addedEntities: SyncedEntityProps<Entity>[];
//   removedEntities: SyncedEntityProps<Entity>[];
//   changedEntities: { id: SnowflakeId; patches: Patch[] }[];
// };

// const hasAccess = (entity: Entity, connectionEntity: ConnectionEntity) => {
//   // todo implement access checks here
//   // ie (if room === "public") return true
//   // each entity schema can have it's own function for implement access control
//   return true;
// };

// export const entityRouter = router({
//   create: protectedProcedure.input(EntityPropsSchema).mutation(({ input }) => {
//     // TODO check that we have permission to do it
//     const entity = createEntity(input);
//     world.add(entity);
//   }),
//   list: publicProcedure.subscription(({ ctx }) => {
//     // Track if entities get removed
//     const myEntities = new Map<SnowflakeId, Entity>();
//     const myEntitySubscriptions = new Map<SnowflakeId, AnyFunction>();
//     const addedIds = new Set<SnowflakeId>();
//     const changedIds = new Set<SnowflakeId>();
//     const removedIds = new Set<SnowflakeId>();
//     // const entityDeltas = new Map<SnowflakeId, EntityDelta[]>();
//     // const changedProps = new Map<SnowflakeId, Set<EntityDataKey>>();

//     for (const entity of world.entities) {
//       if (hasAccess(entity, ctx.connectionEntity)) {
//         myEntities.set(entity.id, entity);
//         addedIds.add(entity.id);
//       }
//     }

//     const unsubscribeOnAdd = world.onEntityAdded.add((entity) => {
//       const nowHasAccess = hasAccess(entity, ctx.connectionEntity);
//       if (nowHasAccess) {
//         myEntities.set(entity.id, entity);
//         addedIds.add(entity.id);
//       }

//       // TODO cleanup these subscriptions
//       const unsub = entity.subscribe((event) => {
//         if (event.type === 'CHANGE') {
//           const previousHasAccess = myEntities.has(entity.id);
//           const nowHasAccess = hasAccess(entity, ctx.connectionEntity);
//           if (!previousHasAccess && nowHasAccess) {
//             myEntities.set(entity.id, entity);
//             addedIds.add(entity.id);
//             removedIds.delete(entity.id); // in case case we previously removed it but it wasnt flushed
//           } else if (previousHasAccess && !nowHasAccess) {
//             myEntities.delete(entity.id);
//             removedIds.add(entity.id);
//             addedIds.delete(entity.id); // in case case we previously removed it but it wasnt flushed
//           }

//           let deltas = entityDeltas.get(entity.id);
//           if (!deltas) {
//             deltas = [];
//             entityDeltas.set(entity.id, deltas);
//           }
//           deltas.push(event.delta);
//           changedIds.add(entity.id);
//         }
//       });
//       myEntitySubscriptions.set(entity.id, unsub);
//     });

//     const unsubscribeOnRemove = world.onEntityRemoved.add((entity) => {
//       const previousHasAccess = myEntities.has(entity.id);
//       if (previousHasAccess) {
//         removedIds.add(entity.id);
//       }

//       const unsub = myEntitySubscriptions.get(entity.id);
//       if (unsub) {
//         unsub();
//       }
//     });

//     // baseEntityIndex$.subscribe((event) => {
//     //   if (event.type === 'ADD' || event.type === 'REMOVE') {
//     //     const entity = event.data;

//     //     const previousHasAccess = myEntities.has(entity.id);
//     //     const nowHasAccess = hasAccess(entity, ctx.connectionEntity);

//     //     if (nowHasAccess) {
//     //       myEntities.set(entity.id, entity);
//     //     } else {
//     //       myEntities.delete(entity.id);
//     //     }

//     //     if (previousHasAccess && !nowHasAccess) {
//     //       removedIds.add(entity.id);

//     //       // Unsubscribe from updates
//     //       const sub = myEntitySubscriptions.get(entity.id);
//     //       if (sub) {
//     //         sub();
//     //       }
//     //     } else if (!previousHasAccess && nowHasAccess) {
//     //       addedIds.add(entity.id);
//     //     }
//     //   } else if (event.type === 'CHANGE') {
//     //     const entityId = event.data.id;

//     //     if (myEntities.has(entityId)) {
//     //       let changedPropsSet = changedProps.get(entityId);
//     //       if (!changedPropsSet) {
//     //         changedPropsSet = new Set();
//     //         changedProps.set(entityId, changedPropsSet);
//     //       }
//     //       // TODO store the full delta
//     //       changedPropsSet.add(event.delta.property);
//     //       changedIds.add(entityId);
//     //     }
//     //   }
//     // });

//     const flush = (emit: Observer<EntityListEvent, unknown>) => {
//       if (addedIds.size || removedIds.size || changedIds.size) {
//         const addedEntities = Array.from(addedIds).map(
//           (id) => myEntities.get(id)!
//         );
//         const removedEntities = Array.from(removedIds).map(
//           (id) => myEntities.get(id)!
//         );

//         const changedEntities = Array.from(changedIds).map((id) => {
//           const deltas = entityDeltas.get(id)!;
//           return {
//             id,
//             deltas,
//           };
//         });

//         emit.next({
//           addedEntities: addedEntities.map(removeFunctions),
//           removedEntities: removedEntities.map(removeFunctions),
//           changedEntities,
//         });

//         addedIds.clear();
//         removedIds.clear();

//         for (const id in changedIds) {
//           entityDeltas.get(id)!.length = 0;
//         }
//         changedIds.clear();
//       }
//     };

//     return observable<EntityListEvent>((emit) => {
//       // Send the initiale entities..
//       flush(emit);

//       // Every tick, check to see if entities were added or removed
//       // If they were, flush them, then clear out the sets for tracking
//       const event$ = from(interval(1000 / TICK_RATE)).subscribe(() => {
//         flush(emit);
//       });

//       return () => {
//         event$.unsubscribe();
//         unsubscribeOnAdd();
//         unsubscribeOnRemove();
//       };
//     });
//   }),

//   // changes: protectedProcedure
//   //   .input(
//   //     z.object({
//   //       id: SnowflakeIdSchema,
//   //     })
//   //   )
//   //   .subscription(async ({ ctx, input }) => {
//   //     const entity = baseEntityIndex.get(input.id);
//   //     if (!entity) {
//   //       throw new TRPCError({
//   //         code: 'NOT_FOUND',
//   //         message: `Entity ${input.id} not found`,
//   //       });
//   //     }

//   //     if (!hasAccess(entity, ctx.connectionEntity)) {
//   //       throw new TRPCError({
//   //         code: 'FORBIDDEN',
//   //         message: `Forbidden access to entity {input.id}`,
//   //       });
//   //     }

//   //     return observable<EntityChangeEvent>((emit) => {
//   //       // Every tick, check to see if entities were added or removed
//   //       // If they were, flush them, then clear out the sets for tracking
//   //       const event$ = from(interval(1000 / TICK_RATE)).subscribe(() => {
//   //         // if (addedIds.size || removedIds.size) {
//   //         //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   //         //   const addedEntities = Array.from(addedIds).map(
//   //         //     (id) => myEntities.get(id)!
//   //         //   );
//   //         //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   //         //   const removedEntities = Array.from(removedIds).map(
//   //         //     (id) => myEntities.get(id)!
//   //         //   );
//   //         //   emit.next({
//   //         //     addedEntities,
//   //         //     removedEntities,
//   //         //   });
//   //         //   addedIds.clear();
//   //         //   removedIds.clear();
//   //         // }
//   //       });
//   //     });
//   //   }),
// });
// // send: protectedProcedure
// //   .input(
// //     z.object({
// //       id: SnowflakeIdSchema,
// //       event: EntityEventSchema,
// //     })
// //   )
// //   .mutation(async ({ input }) => {
// //     const store = await getEntityStore(input.id);
// //     store.send(event);
// //   }),

// // type TStore<TEntity extends Entity, TEvent extends { type: string }> = {
// //   id: SnowflakeId;
// //   send: (event: TEvent) => void;
// //   getSnapshot: () => TEntity | undefined;
// //   subscribe: (callback: (entity: Entity) => void) => void;
// // };
// // const storeMap = new Map<SnowflakeId, TStore<any, any>>();

// // todo: make this isomorphic to be able to run on client as well
// // maybe here you inject the a declaraative config
// // some things to consider
// // - add a storeRef propt ot he entity
// // - define the name of that prop
// // - add machine to that entity
// // - define the name of that machine
// // this is the builder/composition part of it
// // we are building up pieces
// // so effectively it's adding a component maybe?
// // thats the idea, but lets not call it that. let's call it what it is
// // a storeRef
// //
// //
// // `storeRef`
// //
// //  Entity service refs
// //    is a store and a service the same thing? Effecitively, yes.
// // .   the difference between a store and a service si that a service
// // .   has a state machine associated with it
// // That get's defined

// // const getEntityStore = (<TEntity extends Entity, TEvent extends { type: string }>(id: SnowflakeId) => {
// //   type Store = TStore<TEntity, TEvent>;

// //   const store = storeMap.get(id);
// //   if (store) {
// //     return store as Store;
// //   }

// //   const send = <TEvent>(event: TEvent) => {
// //     console.log(event);
// //   }

// //   const getSnapshot = <TEntity>() => {
// //     return {} as TEntity | undefined;
// //   }

// //   const subscribe = (callback: (entity: TEntity) => void) => {
// //     return;
// //   }

// //   const newStore = {
// //     id,
// //     send,
// //     getSnapshot,
// //     subscribe
// //   } satisfies Store;
// //   storeMap.set(id, newStore)

// //   return newStore;
// // }

// // const getEntityServiceWithErrors = async (id: SnowflakeId) => {
// //   let service: AnyInterpreter | undefined;
// //   try {
// //     service = await getEntityService(id);
// //   } catch (ex) {
// //     throw new TRPCError({
// //       code: 'INTERNAL_SERVER_ERROR',
// //       message: 'Error when getting entity service',
// //       cause: ex,
// //     });
// //   }

// //   if (!service) {
// //     throw new TRPCError({
// //       code: 'BAD_REQUEST',
// //       message: "Couldn't find entity service",
// //     });
// //   }

// //   return service;
// // };

// // {
// //   "rules": {
// //     "<<path>>": {
// //     // Allow the request if the condition for each method is true.
// //       ".read": <<condition>>,
// //       ".write": <<condition>>
// //     }
// //   }
// // }

// // const [_, entity$] = createArchetypeIndex(world.with('id'), 'id');

// // const selectUserData = () => {
// //   return {
// //     hello: 'there',
// //   } as const;
// // };

// // // Define the hasAccess function
// // async function hasAccess(entity: Entity, userEntity: UserEntity | null) {
// //   // Implement the logic to determine if the user has access to the entity.
// //   // If userEntity is null, the entity is publicly accessible.
// //   // ...
// //   return true;
// // }

// // const selectAccess = (entityState: AnyState) => {
// //   return {};
// // };
