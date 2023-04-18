// import { createArchetypeIndex, TICK_RATE } from '../../ecs';
import {
  ConnectionEntity,
  Entity,
  EntityDataKey,
  EntityProps,
  SnowflakeId,
} from '@explorers-club/schema';
import { AnyFunction } from '@explorers-club/utils';
import { Observer, observable } from '@trpc/server/observable';
import { from, interval } from 'rxjs';
import { TICK_RATE } from '../../ecs.constants';
import { createArchetypeIndex } from '../../indices';
import { publicProcedure, router } from '../../trpc';
import { world } from '../../world';
import { D } from '@mobily/ts-belt';

const [baseEntityIndex, baseEntityIndex$] = createArchetypeIndex(
  world.with('id', 'schema'),
  'id'
);

type ChangedEntityProps = Partial<EntityProps<Entity>> & { id: SnowflakeId };

type EntityListEvent = {
  addedEntities: Entity[];
  removedEntities: Entity[];
  changedEntities: ChangedEntityProps[]; // tood Omit schema?
};

const hasAccess = (entity: Entity, connectionEntity: ConnectionEntity) => {
  // todo implement access checks here
  // ie (if room === "public") return true
  // each entity schema can have it's own function for implement access control
  return true;
};

export const entityRouter = router({
  list: publicProcedure.subscription(({ ctx }) => {
    // Track if entities get removed
    const myEntities = new Map<SnowflakeId, Entity>();
    const myEntitySubscriptions = new Map<SnowflakeId, AnyFunction>();
    const addedIds = new Set<SnowflakeId>();
    const changedIds = new Set<SnowflakeId>();
    const removedIds = new Set<SnowflakeId>();
    const changedProps = new Map<SnowflakeId, Set<EntityDataKey>>();

    for (const entity of world.entities) {
      if (hasAccess(entity, ctx.connectionEntity)) {
        myEntities.set(entity.id, entity);
        addedIds.add(entity.id);
      }
    }

    baseEntityIndex$.subscribe((event) => {
      if (event.type === 'ADD' || event.type === 'REMOVE') {
        const entity = event.data;

        const previousHasAccess = myEntities.has(entity.id);
        const nowHasAccess = hasAccess(entity, ctx.connectionEntity);

        if (nowHasAccess) {
          myEntities.set(entity.id, entity);
        } else {
          myEntities.delete(entity.id);
        }

        if (previousHasAccess && !nowHasAccess) {
          removedIds.add(entity.id);

          // Unsubscribe from updates
          const sub = myEntitySubscriptions.get(entity.id);
          if (sub) {
            sub();
          }
        } else if (!previousHasAccess && nowHasAccess) {
          addedIds.add(entity.id);
        }
      } else if (event.type === 'CHANGE') {
        const entityId = event.data.id;

        if (myEntities.has(entityId)) {
          let changedPropsSet = changedProps.get(entityId);
          if (!changedPropsSet) {
            changedPropsSet = new Set();
            changedProps.set(entityId, changedPropsSet);
          }
          changedPropsSet.add(event.delta.property);
          changedIds.add(entityId);
        }
      }
    });

    const flush = (emit: Observer<EntityListEvent, unknown>) => {
      if (addedIds.size || removedIds.size || changedIds.size) {
        console.log({ addedIds, removedIds, changedIds });
        const addedEntities = Array.from(addedIds).map(
          (id) => myEntities.get(id)!
        );
        const removedEntities = Array.from(removedIds).map(
          (id) => myEntities.get(id)!
        );

        const changedEntities = Array.from(changedIds).map((id) => {
          const changedPropsSet = changedProps.get(id)!;
          const entity = myEntities.get(id)!;

          return D.filterWithKey(
            entity,
            (key) => changedPropsSet.has(key) || key === 'id'
          );
        });

        // TODO we only want to send the data props over, excluding entity methods
        // how do we do that? do we need to?
        emit.next({
          addedEntities,
          removedEntities,
          changedEntities: changedEntities as ChangedEntityProps[],
        });

        addedIds.clear();
        removedIds.clear();

        for (const id in changedIds) {
          changedProps.get(id)?.clear();
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
      };
    });
  }),

  // changes: protectedProcedure
  //   .input(
  //     z.object({
  //       id: SnowflakeIdSchema,
  //     })
  //   )
  //   .subscription(async ({ ctx, input }) => {
  //     const entity = baseEntityIndex.get(input.id);
  //     if (!entity) {
  //       throw new TRPCError({
  //         code: 'NOT_FOUND',
  //         message: `Entity ${input.id} not found`,
  //       });
  //     }

  //     if (!hasAccess(entity, ctx.connectionEntity)) {
  //       throw new TRPCError({
  //         code: 'FORBIDDEN',
  //         message: `Forbidden access to entity {input.id}`,
  //       });
  //     }

  //     return observable<EntityChangeEvent>((emit) => {
  //       // Every tick, check to see if entities were added or removed
  //       // If they were, flush them, then clear out the sets for tracking
  //       const event$ = from(interval(1000 / TICK_RATE)).subscribe(() => {
  //         // if (addedIds.size || removedIds.size) {
  //         //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         //   const addedEntities = Array.from(addedIds).map(
  //         //     (id) => myEntities.get(id)!
  //         //   );
  //         //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         //   const removedEntities = Array.from(removedIds).map(
  //         //     (id) => myEntities.get(id)!
  //         //   );
  //         //   emit.next({
  //         //     addedEntities,
  //         //     removedEntities,
  //         //   });
  //         //   addedIds.clear();
  //         //   removedIds.clear();
  //         // }
  //       });
  //     });
  //   }),
});
// send: protectedProcedure
//   .input(
//     z.object({
//       id: SnowflakeIdSchema,
//       event: EntityEventSchema,
//     })
//   )
//   .mutation(async ({ input }) => {
//     const store = await getEntityStore(input.id);
//     store.send(event);
//   }),

// type TStore<TEntity extends Entity, TEvent extends { type: string }> = {
//   id: SnowflakeId;
//   send: (event: TEvent) => void;
//   getSnapshot: () => TEntity | undefined;
//   subscribe: (callback: (entity: Entity) => void) => void;
// };
// const storeMap = new Map<SnowflakeId, TStore<any, any>>();

// todo: make this isomorphic to be able to run on client as well
// maybe here you inject the a declaraative config
// some things to consider
// - add a storeRef propt ot he entity
// - define the name of that prop
// - add machine to that entity
// - define the name of that machine
// this is the builder/composition part of it
// we are building up pieces
// so effectively it's adding a component maybe?
// thats the idea, but lets not call it that. let's call it what it is
// a storeRef
//
//
// `storeRef`
//
//  Entity service refs
//    is a store and a service the same thing? Effecitively, yes.
// .   the difference between a store and a service si that a service
// .   has a state machine associated with it
// That get's defined

// const getEntityStore = (<TEntity extends Entity, TEvent extends { type: string }>(id: SnowflakeId) => {
//   type Store = TStore<TEntity, TEvent>;

//   const store = storeMap.get(id);
//   if (store) {
//     return store as Store;
//   }

//   const send = <TEvent>(event: TEvent) => {
//     console.log(event);
//   }

//   const getSnapshot = <TEntity>() => {
//     return {} as TEntity | undefined;
//   }

//   const subscribe = (callback: (entity: TEntity) => void) => {
//     return;
//   }

//   const newStore = {
//     id,
//     send,
//     getSnapshot,
//     subscribe
//   } satisfies Store;
//   storeMap.set(id, newStore)

//   return newStore;
// }

// const getEntityServiceWithErrors = async (id: SnowflakeId) => {
//   let service: AnyInterpreter | undefined;
//   try {
//     service = await getEntityService(id);
//   } catch (ex) {
//     throw new TRPCError({
//       code: 'INTERNAL_SERVER_ERROR',
//       message: 'Error when getting entity service',
//       cause: ex,
//     });
//   }

//   if (!service) {
//     throw new TRPCError({
//       code: 'BAD_REQUEST',
//       message: "Couldn't find entity service",
//     });
//   }

//   return service;
// };

// {
//   "rules": {
//     "<<path>>": {
//     // Allow the request if the condition for each method is true.
//       ".read": <<condition>>,
//       ".write": <<condition>>
//     }
//   }
// }

// const [_, entity$] = createArchetypeIndex(world.with('id'), 'id');

// const selectUserData = () => {
//   return {
//     hello: 'there',
//   } as const;
// };

// // Define the hasAccess function
// async function hasAccess(entity: Entity, userEntity: UserEntity | null) {
//   // Implement the logic to determine if the user has access to the entity.
//   // If userEntity is null, the entity is publicly accessible.
//   // ...
//   return true;
// }

// const selectAccess = (entityState: AnyState) => {
//   return {};
// };
