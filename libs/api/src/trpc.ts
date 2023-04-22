import { InitializedConnectionEntity } from '@explorers-club/schema';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isInitialized = t.middleware(
  async ({ ctx: { connectionEntity, ...ctx }, next }) => {
    if (connectionEntity.states.Initialized !== 'True') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Connection not yet initialized',
      });
    }

    return next({
      ctx: {
        ...ctx,
        connectionEntity: connectionEntity as InitializedConnectionEntity,
      },
    });
  }
);

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isInitialized);
