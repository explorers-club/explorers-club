// import { createArchetypeIndex } from '@explorers-club/ecs';
// import { EntityBase, SnowflakeId } from '@explorers-club/schema';
// import { observable } from '@trpc/server/observable';
// import { Subscription } from 'xstate';
// import { entityServices } from '../services';
// import { publicProcedure, router } from '../trpc';
// import { world } from '../world';

// const baseEntityArchetype = world.with('id');

// export const entityRouter = router({
//   all: publicProcedure.subscription(() => {
//     return observable<
//       | { type: 'INIT'; data: EntityBase[] }
//       | { type: 'ADD'; data: EntityBase }
//       | { type: 'CHANGE'; data: EntityBase }
//       | { type: 'REMOVE'; data: EntityBase }
//     >((emit) => {
//       const subscriptionMap = new Map<SnowflakeId, Subscription>();

//       emit.next({
//         type: 'INIT',
//         data: Array.from(baseEntityArchetype.entities),
//       });

//       baseEntityArchetype.onEntityAdded.add((entity) => {
//         const entityService = entityServices.get(entity.id);
//         // todo how do we handle entities that dont have a "backing services"
//         // should we still sync them? how do we do so without flshing
//         if (!entityService) {
//           console.warn('no entity service for ', entity);
//           console.warn(
//             "no 'change' events will be emitted for entity in entity subscription"
//           );
//           return;
//         }
//         emit.next({
//           type: 'ADD',
//           data: entity,
//         });

//         const sub = entityService.subscribe(() => {
//           emit.next({
//             type: 'CHANGE',
//             data: entity,
//           });
//         });
//         subscriptionMap.set(entity.id, sub);
//       });

//       baseEntityArchetype.onEntityRemoved.add((entity) => {
//         const sub = subscriptionMap.get(entity.id);
//         if (sub) {
//           sub.unsubscribe();
//         }

//         emit.next({
//           type: 'REMOVE',
//           data: entity,
//         });
//       });
//     });
//   }),
// });
