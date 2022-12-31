import { router } from '../trpc';
import { tileRouter } from './tiles';

export const apiRouter = router({
  tile: tileRouter,
});

// export type definition of API
export type ApiRouter = typeof apiRouter;
