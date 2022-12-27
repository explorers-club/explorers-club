import { router } from '../trpc';
import { tileRouter } from './tiles';

export const appRouter = router({
  tile: tileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
