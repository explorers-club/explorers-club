import { ClubNameSchema } from '@explorers-club/schema';
import { z } from 'zod';
import { protectedProcedure, router } from '../../trpc';
import { TRPCError } from '@trpc/server';

export const profileRouter = router({
  setPlayerName: protectedProcedure
    .input(z.object({ name: ClubNameSchema }))
    .mutation(async ({ ctx, input }) => {
      // const { userId } = ctx.connectionEntity;
      // const { supabaseClient } = ctx.connectionEntity.context;
      // const { error } = await supabaseClient
      //   .from('profiles')
      //   .update({ player_name: input.name })
      //   .eq('user_id', userId);
      // if (error) {
      //   throw new TRPCError({
      //     code: 'INTERNAL_SERVER_ERROR',
      //     message: error.message,
      //     cause: error,
      //   });
      // }
      // const { data, error: fetchError } = await supabaseClient
      //   .from('profiles')
      //   .select('*')
      //   .eq('user_id', supabaseSession.user.id)
      //   .maybeSingle();
      // if (fetchError) {
      //   throw new TRPCError({
      //     code: 'INTERNAL_SERVER_ERROR',
      //     message: fetchError.message,
      //     cause: fetchError,
      //   });
      // }
      // return { data };
    }),
});
