import { FromObservable } from '@explorers-club/utils';
import { observable } from '@trpc/server/observable';
import { filter } from 'rxjs';
import { archetypes } from '../ecs/archetypes';
import { SnowflakeIdSchema } from '../ecs/schema';
import {
  createArchetypeEvent$,
  createArchetypeIndex,
  isArchetypeEntityEvent,
} from '../ecs/utils';
import { publicProcedure, router } from '../trpc';

const sharedEntitiesIndex = createArchetypeIndex(archetypes.shared);
const sharedEntitiesEvent$ = createArchetypeEvent$(archetypes.shared);

const entityEvent$ = sharedEntitiesEvent$.pipe(filter(isArchetypeEntityEvent));

export const entityRouter = router({
  snapshot: publicProcedure.input(SnowflakeIdSchema).query(({ input }) => {
    return sharedEntitiesIndex.get(input);
  }),
  onChange: publicProcedure
    .input(SnowflakeIdSchema)
    .subscription(({ input }) => {
      const myEvents$ = entityEvent$.pipe(
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
