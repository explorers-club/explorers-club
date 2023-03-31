import { createArchetypeIndex } from '@explorers-club/ecs';
import { ConnectionInitializeInputSchema } from '@explorers-club/schema';
import { TRPCError } from '@trpc/server';
import { waitFor } from 'xstate/lib/waitFor';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../../trpc';
import { world } from '../../world';

// const [deviceEntityIndex] = createArchetypeIndex(
//   world.with('id', 'schema', 'supabaseSessionId'),
//   'supabaseSessionId'
// );
const [sessionEntityIndex] = createArchetypeIndex(
  world.with(
    'id',
    'sessionId',
    'lastHeartbeatAt',
    'connected',
    'currentLocation'
  ),
  'sessionId'
);

export const connectionRouter = router({
  heartbeat: protectedProcedure
    .input(z.object({ location: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      ctx.connectionService.send({
        type: 'HEARTBEAT',
      });
    }),
  navigate: protectedProcedure
    .input(z.object({ location: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      ctx.connectionService.send({
        type: 'NAVIGATE',
        location: input.location,
      });
      // const session = sessionEntityIndex.get(ctx.authState.sessionId);
      // if (!session) {
      //   throw new TRPCError({
      //     code: 'BAD_REQUEST',
      //     message: "Couldn't find session",
      //   });
      // }

      // session.currentLocation = input.location;
      // return session;
    }),

  initialize: publicProcedure
    .input(ConnectionInitializeInputSchema)
    .mutation(async ({ ctx, input }) => {
      ctx.connectionService.send({
        type: 'INITIALIZE',
        ...input,
      });

      await waitFor(ctx.connectionService, (state) =>
        state.matches('Initialized')
      );

      const state = ctx.connectionService.getSnapshot();
      if (!state.matches('Initialized')) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Connection in unexpected state',
        });
      }

      return state.context.entity;
    }),
});
