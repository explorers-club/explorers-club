import { initTRPC, TRPCError } from '@trpc/server';
// import { JwtPayload } from 'jsonwebtoken';
import superjson from 'superjson';
import { type Context } from './context';

// export interface SessionTokenJwtPayload extends JwtPayload {
//   sessionId: string;
// }

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(
  async ({ ctx: { connectionService, ...ctx }, next }) => {
    const connectionState = connectionService.getSnapshot();
    if (!connectionState.matches("Initialized")) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Connection not yet initialized',
      });
    }

    return next({
      ctx: {
        ...ctx,
        connectionState,
      },
    });
  }
);

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
