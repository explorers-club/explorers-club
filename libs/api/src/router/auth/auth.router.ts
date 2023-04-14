import {
  ConnectionEntitySchema,
  LoginInputSchema,
} from '@explorers-club/schema';
import { TRPCError } from '@trpc/server';
import { waitFor } from 'xstate/lib/waitFor';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../../trpc';

export const authRouter = router({
  register: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const { supabaseClient } = ctx.sessionService.getSnapshot().context;
      // const { email, password } = input;
      // await supabaseClient.auth.updateUser({
      //   email,
      //   password,
      // });
    }),
  login: protectedProcedure
    .input(LoginInputSchema)
    .mutation(async ({ ctx, input }) => {
      // const state = ctx.connectionEntity.matches({ Initialized: 'True' });
      // ctx.connectionEntity.matches()
      // f.matches({ Initi})
      // f.send({})
      // f.states.Initialized === "True"

      // ctx.connectionService.send("LOGIN")
      // const isInitialized = state.matches('Initialized');
      // if (isInitialized) {
      //   const userId = state.context.supabaseSession.user.id;
      // } else {
      // ctx.con
      // }

      // const { supabaseClient } = ctx.sessionService.getSnapshot().context;
      // const { email, password } = input;

      // const { data, error } = await supabaseClient.auth.signInWithPassword({
      //   email,
      //   password,
      // });

      // if (error) {
      //   throw new TRPCError({
      //     code: 'INTERNAL_SERVER_ERROR',
      //     message: error.message,
      //     cause: error,
      //   });
      // }

      // if (!data.session) {
      //   throw new TRPCError({
      //     code: 'UNAUTHORIZED',
      //     message: 'Failed to get session',
      //   });
      // }

      // ctx.sessionService.send({
      //   type: "START"
      // })

      // ctx.sessionService.send({
      //   type: 'LOGIN',
      //   email: input.email,
      //   password: input.password,
      // });

      // const result = await waitFor(ctx.sessionService, (state) =>
      //   state.matches('Initialized.Yes')
      // );

      // const user =
      //   ctx.sessionService.getSnapshot().context.supabaseSession?.user;
      // if (!user) {
      //   throw new TRPCError({
      //     code: 'INTERNAL_SERVER_ERROR',
      //     message: "couldn't get user",
      //   });
      // }

      // return user;
    }),
  // getAccessToken: protectedProcedure.query(({ ctx }) => {
  //   return { accessToken: ctx.accessToken };
  // }),
});
