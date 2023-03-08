import { FromObservable } from '@explorers-club/utils';
import { observable } from '@trpc/server/observable';
import { filter } from 'rxjs';
import {
  ECEpochTimestamp,
  EntityPolicy,
  EntitySchema,
  SnowflakeId,
  SnowflakeIdSchema
} from '../ecs/schema';
import {
  createArchetypeEvent$,
  createArchetypeIndex,
  isArchetypeEntityEvent,
  isArchetypeListEvent
} from '../ecs/utils';
import { world } from '../ecs/world';
import { publicProcedure, router } from '../trpc';

const sharedArchetype = world.with<{
  id: SnowflakeId;
  flushedAt: ECEpochTimestamp;
  schema: EntitySchema;
  policy: EntityPolicy;
  children: SnowflakeId[];
}>('id', 'flushedAt', 'schema', 'policy', 'children');

const sharedEntitiesIndex = createArchetypeIndex(sharedArchetype);
const sharedEntitiesEvent$ = createArchetypeEvent$(sharedArchetype);

export const entityRouter = router({
  all: publicProcedure.subscription(() => {
    // todo filter
    const myEvents$ = sharedEntitiesEvent$.pipe(filter(isArchetypeListEvent));

    return observable<FromObservable<typeof myEvents$>>((emit) => {
      const sub = myEvents$.subscribe(emit.next);

      return () => {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      };
    });
  }),
  snapshot: publicProcedure.input(SnowflakeIdSchema).query(({ input }) => {
    return sharedEntitiesIndex.get(input);
  }),
  onChange: publicProcedure
    .input(SnowflakeIdSchema)
    .subscription(({ input }) => {
      const myEvents$ = sharedEntitiesEvent$.pipe(
        filter(isArchetypeEntityEvent),
        filter((event) => event.data.id === input)
      );

      return observable<FromObservable<typeof myEvents$>>((emit) => {
        const sub = myEvents$.subscribe(emit.next);

        return () => {
          if (!sub.closed) {
            sub.unsubscribe();
          }
        };
      });
    }),
});
