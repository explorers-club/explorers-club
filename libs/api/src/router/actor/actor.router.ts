// import {
//   createArchetypeEvent$,
//   generateSnowflakeId,
//   getCurrentTimestamp,
//   isArchetypeListEvent,
// } from '@explorers-club/ecs';
// import {
//   ActorId,
//   MachineOptionsSchema,
//   ActorSchema,
//   ActorType,
//   ActorTypeSchema,
//   ECEpochTimestamp,
//   SnowflakeId,
//   SnowflakeIdSchema,
//   ActorEntity,
//   SharedEntity,
// } from '@explorers-club/schema';
// import { FromObservable } from '@explorers-club/utils';
// import { observable } from '@trpc/server/observable';
// import { filter } from 'rxjs';
// import { AnyInterpreter, interpret, StateValue } from 'xstate';
// import { z } from 'zod';
// import { world } from '../../world';
// import { protectedProcedure, publicProcedure, router } from '../../trpc';
// import { createMachineWithOptions } from './actor.config';

// // const actorArchetype = world.with<Actor>('id', 'flushedAt');


// const actorArchetype = world.with<ActorEntity>(
//   'id',
//   'flushedAt',
//   'actorType',
//   'context',
//   'states'
// );
// const actorEntitiesEvent$ = createArchetypeEvent$(actorArchetype);

// const actorEventQueues = new Map<ActorId, unknown[]>();
// const actorMap = new Map<ActorId, AnyInterpreter>();
// const actorWorkers = new Map<ActorId, NodeJS.Timer>();

// // unitializedActorArchetype.onEntityAdded.add((entity) => {
// //   const result = ActorSchema.safeParse(entity);
// //   console.log({ result });
// //   if (!result.success) {
// //     console.warn('error parsing entity', entity);
// //     return;
// //   }

// //   const { id, actorType } = result.data;

// //   let machine = actorMachines[actorType];
// //   if (entity.context) {
// //     machine = machine.withContext(entity.context);
// //   }

// //   console.log('starting actor');
// //   const actor = interpret(machine).start();
// //   const snap = actor.getSnapshot();
// //   world.update(entity, {
// //     states: snap.value,
// //     context: snap.context,
// //     flushedAt: getCurrentTimestamp(),
// //   });
// //   const actorEventQueue: unknown[] = [];
// //   actorEventQueues.set(id, actorEventQueue);

// //   const workerId = setInterval(() => {
// //     actorEventQueue.forEach((event) => {
// //       actor.send(event);
// //     });
// //     if (actorEventQueue.length > 0) {
// //       const snap = actor.getSnapshot();
// //       // If we have any events processed, update state
// //       world.update(entity, {
// //         states: snap.value,
// //         context: snap.context,
// //         flushedAt: getCurrentTimestamp(),
// //       });
// //     }
// //     actorEventQueue.length = 0;
// //   }, 1000 / 60);

// //   actorWorkers.set(id, workerId);
// //   actorMap.set(id, actor);
// // });

// // unitializedActorArchetype.onEntityRemoved.add((entity) => {
// //   const actor = actorMap.get(entity.id);
// //   if (!actor) {
// //     console.warn("couldn't find actor after entity was removed");
// //     return;
// //   }
// //   actor.stop();
// //   actorMap.delete(entity.id);
// //   const workerId = actorWorkers.get(entity.id);
// //   if (workerId) {
// //     clearInterval(workerId);
// //   } else {
// //     console.warn(`couldn't find worker id ${workerId}`);
// //   }
// // });

// export const actorRouter = router({
//   list: publicProcedure.subscription(() => {
//     const actorListEvent$ = actorEntitiesEvent$.pipe(
//       filter(isArchetypeListEvent)
//     );
//     return observable<FromObservable<typeof actorListEvent$>>((emit) => {
//       const sub = actorListEvent$.subscribe(emit.next);
//       // todo filter to ensure access based on policy

//       return () => {
//         if (!sub.closed) {
//           sub.unsubscribe();
//         }
//       };
//     });
//   }),
//   create: protectedProcedure
//     .input(MachineOptionsSchema)
//     .mutation(({ ctx, input }) => {
//       const machine = createMachineWithOptions(input);
//       const id = generateSnowflakeId();

//       const actor = interpret(machine).start();
//       const state = actor.getSnapshot();
//       const actorEntity = {
//         id,
//         flushedAt: getCurrentTimestamp(),
//         actorType: input.actorType,
//         states: state,
//         schema: 'actor',
//         context: actor.getSnapshot().context,
//         children: [],
//       };
//       const snap = actor.getSnapshot();
//       // world.add({
//       //   id,
//       // });

//       const actorEventQueue: unknown[] = [];
//       actorEventQueues.set(id, actorEventQueue);

//       // const workerId = setInterval(() => {
//       //   actorEventQueue.forEach((event) => {
//       //     actor.send(event);
//       //   });
//       //   if (actorEventQueue.length > 0) {
//       //     const snap = actor.getSnapshot();
//       //     // If we have any events processed, update state
//       //     world.update(entity, {
//       //       states: snap.value,
//       //       context: snap.context,
//       //       flushedAt: getCurrentTimestamp(),
//       //     });
//       //   }
//       //   actorEventQueue.length = 0;
//       // }, 1000 / 60);

//       // actorWorkers.set(id, workerId);
//       // actorMap.set(id, actor);
//       // return world.add(actorEntity);
//     }),
//   send: protectedProcedure
//     .input(z.object({ id: SnowflakeIdSchema, event: z.unknown() }))
//     .mutation(({ ctx, input: { id, event } }) => {
//       const actorEventQueue = actorEventQueues.get(id);
//       if (!actorEventQueue) {
//         throw new Error(`no running actor for id ${id}`);
//       }
//       // todo: add userId and ts to event payload here
//       actorEventQueue.push(event);
//       return event;
//     }),
// });
