import { router } from '../trpc';
import { actorRouter } from './actor';
import { entityRouter } from './entity';
import { tileRouter } from './tiles';

export const apiRouter = router({
  tile: tileRouter,
  actor: actorRouter,
  entity: entityRouter,
});

// export type definition of API
export type ApiRouter = typeof apiRouter;
