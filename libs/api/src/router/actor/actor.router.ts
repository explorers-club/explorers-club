// Actors are entities that run state machines

// The entity get's passed in to the machine

import { FromObservable } from '@explorers-club/utils';
import { B } from '@mobily/ts-belt';
import { observable } from '@trpc/server/observable';
import { filter } from 'rxjs';
import { clearInterval } from 'timers';
import { AnyInterpreter, interpret, StateValue } from 'xstate';
import { z } from 'zod';
import {
  ActorEntity,
  ActorId,
  ActorSchema,
  ActorType,
  ActorTypeSchema,
  ECEpochTimestamp,
  SnowflakeId,
  SnowflakeIdSchema,
} from '../../ecs/schema';
import {
  createArchetypeEvent$,
  generateSnowflakeId,
  getCurrentTimestamp,
  isArchetypeAddEvent,
  isArchetypeListEvent,
  isArchetypeRemoveEvent,
} from '../../ecs/utils';
import { world } from '../../ecs/world';
import { publicProcedure, router } from '../../trpc';
import { actorMachines } from './actor.config';

const unitializedActorArchetype = world.with<{
  id: SnowflakeId;
  flushedAt: ECEpochTimestamp;
  actorType: ActorType;
  context: unknown;
}>('id', 'flushedAt', 'actorType', 'context');

const actorArchetype = world.with<{
  id: SnowflakeId;
  flushedAt: ECEpochTimestamp;
  actorType: ActorType;
  context: unknown;
  states: StateValue;
}>('id', 'flushedAt', 'actorType', 'context', 'states');
const actorEntitiesEvent$ = createArchetypeEvent$(actorArchetype);

const actorEventQueues = new Map<ActorId, unknown[]>();
const actorMap = new Map<ActorId, AnyInterpreter>();
const actorWorkers = new Map<ActorId, NodeJS.Timer>();

unitializedActorArchetype.onEntityAdded.add((entity) => {
  const result = ActorSchema.safeParse(entity);
  if (!result.success) {
    console.warn('error parsing entity', entity);
    return;
  }

  const { id, actorType } = result.data;

  let machine = actorMachines[actorType];
  if (entity.context) {
    machine = machine.withContext(entity.context);
  }

  const actor = interpret(machine).start();
  const snap = actor.getSnapshot();
  world.update(entity, {
    states: snap.value,
    context: snap.context,
    flushedAt: getCurrentTimestamp(),
  });
  const actorEventQueue: unknown[] = [];
  actorEventQueues.set(id, actorEventQueue);

  const workerId = setInterval(() => {
    actorEventQueue.forEach((event) => {
      actor.send(event);
    });
    if (actorEventQueue.length > 0) {
      const snap = actor.getSnapshot();
      // If we have any events processed, update state
      world.update(entity, {
        states: snap.value,
        context: snap.context,
        flushedAt: getCurrentTimestamp(),
      });
    }
    actorEventQueue.length = 0;
  }, 1000 / 60);

  actorWorkers.set(id, workerId);
  actorMap.set(id, actor);
});

unitializedActorArchetype.onEntityRemoved.add((entity) => {
  const actor = actorMap.get(entity.id);
  if (!actor) {
    console.warn("couldn't find actor after entity was removed");
    return;
  }
  actor.stop();
  actorMap.delete(entity.id);
  const workerId = actorWorkers.get(entity.id);
  if (workerId) {
    clearInterval(workerId);
  } else {
    console.warn(`couldn't find worker id ${workerId}`);
  }
});

export const actorRouter = router({
  list: publicProcedure.subscription(() => {
    const actorListEvent$ = actorEntitiesEvent$.pipe(
      filter(isArchetypeListEvent)
    );
    return observable<FromObservable<typeof actorListEvent$>>((emit) => {
      const sub = actorListEvent$.subscribe(emit.next);
      // todo filter to ensure access based on policy

      return () => {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      };
    });
  }),
  create: publicProcedure
    .input(z.object({ actorType: ActorTypeSchema, context: z.unknown() }))
    .mutation(({ input: { actorType, context } }) => {
      const actorEntity = {
        id: generateSnowflakeId(),
        flushedAt: getCurrentTimestamp(),
        actorType,
        context: context || {},
      };
      return world.add(actorEntity);
    }),
  send: publicProcedure
    .input(z.object({ id: SnowflakeIdSchema, event: z.unknown() }))
    .mutation(({ input: { id, event } }) => {
      const actorEventQueue = actorEventQueues.get(id);
      if (!actorEventQueue) {
        throw new Error(`no running actor for id ${id}`);
      }
      // todo: add userId and ts to event payload here
      actorEventQueue.push(event);
      return event;
    }),
});
