// import { createArchetypeIndex } from '@explorers-club/ecs';
// import {
//   ConnectionInitializeInputSchema,
//   SessionEntity,
//   UserEntity,
// } from '@explorers-club/schema';
// import { World } from 'miniplex';
// import { createMachine } from 'xstate';
// import { protectedProcedure, publicProcedure, router } from '../../trpc';
// import { world } from '../../world';

// const [sessionEntityIndex] = createArchetypeIndex(
//   world.with(
//     'id',
//     'sessionId',
//     'lastHeartbeatAt',
//     'connected',
//     'currentLocation'
//   ),
//   'sessionId'
// );

// const [userEntityIndex] = createArchetypeIndex(
//   world.with('userId', 'sessions'),
//   'userId'
// );

// // const userIndex$ = createArchetypeIndex(world.with('id', 'userId'));

// export const sessionRouter = router({
//   // navigate: protectedProcedure
//   //   .input(z.object({ location: z.string().url() }))
//   //   .mutation(async ({ ctx, input }) => {
//   //     const session = sessionEntityIndex.get(ctx.authState.sessionId);
//   //     if (!session) {
//   //       throw new TRPCError({
//   //         code: 'BAD_REQUEST',
//   //         message: "Couldn't find session",
//   //       });
//   //     }

//   //     session.currentLocation = input.location;
//   //     return session;
//   //   }),
//   heartbeat: protectedProcedure.mutation(async ({ ctx }) => {
//     // const session = sessionEntityIndex.get(ctx.authState.sessionId);
//     // if (!session) {
//     //   throw new TRPCError({
//     //     code: 'BAD_REQUEST',
//     //     message: "Couldn't find session",
//     //   });
//     // }
//     // const service = entityServices.get(session.id) as
//     //   | SessionInterpreter
//     //   | undefined;
//     // if (!service) {
//     //   throw new TRPCError({
//     //     code: 'INTERNAL_SERVER_ERROR',
//     //     message: "Couldn't find session entity service",
//     //   });
//     // }
//     // service.send('HEARTBEAT');
//     // return session;
//   }),
//   /**
//    * Create a user if tokens are not provided
//    * Sets the session and creates the user entity in the world
//    */
//   start: publicProcedure
//     .input(ConnectionInitializeInputSchema)
//     .mutation(async ({ ctx, input }) => {
//       // if (!ctx.connectionService) {
//       //   throw new TRPCError({
//       //     code: 'INTERNAL_SERVER_ERROR',
//       //     message: 'Unexpected connection service after calling initialize',
//       //   });
//       // }

//       // const id = ctx.connectionService.getSnapshot();
//       const { deviceId, authTokens } = input;

//       ctx.connectionService.send({
//         type: 'INITIALIZE',
//         deviceId,
//         authTokens,
//       });

//       // await waitFor(ctx.connectionService, (state) =>
//       //   state.matches('Initialized')
//       // );

//       // if (!input.authTokens) {
//       //   const { data, error } = await ctx.supabaseClient.auth.signUp({
//       //     email: `anon-${generateRandomString()}@explorers.club`,
//       //     password: `${generateRandomString()}33330`,
//       //   });

//       //   if (error) {
//       //     throw new TRPCError({
//       //       code: 'INTERNAL_SERVER_ERROR',
//       //       message: error.message,
//       //       cause: error,
//       //     });
//       //   }

//       //   if (!data.session) {
//       //     throw new TRPCError({
//       //       code: 'INTERNAL_SERVER_ERROR',
//       //       message: 'Expected session but was missing',
//       //     });
//       //   }
//       //   session = data.session;

//       //   // TODO check to see if they have another session but on another device
//       //   // we can add it to the devices list.

//       //   await ctx.supabaseClient.auth.setSession({
//       //     access_token: data.session.access_token,
//       //     refresh_token: data.session.refresh_token,
//       //   });
//       // } else {
//       //   const { data, error } = await ctx.supabaseClient.auth.setSession({
//       //     refresh_token: input.authTokens.refreshToken,
//       //     access_token: input.authTokens.accessToken,
//       //   });

//       //   if (error) {
//       //     throw new TRPCError({
//       //       code: 'BAD_REQUEST',
//       //       message: error.message,
//       //       cause: error,
//       //     });
//       //   }

//       //   if (!data.session) {
//       //     throw new TRPCError({
//       //       code: 'BAD_REQUEST',
//       //       message: 'Unable to start session',
//       //     });
//       //   }
//       //   session = data.session;
//       // }

//       // const sessionId = getSessionId(session.access_token);

//       // const sessionEntity = sessionEntityIndex.get(sessionId);
//       // if (!sessionEntity) {
//       //   const sessionEntity: SessionEntity = {
//       //     id: generateSnowflakeId(),
//       //     schema: 'session',
//       //     sessionId,
//       //     userId: session.user.id,
//       //     connected: true,
//       //     lastHeartbeatAt: new Date(),
//       //     currentLocation: input.initialLocation, // todo include in request
//       //   };
//       //   world.add(sessionEntity);
//       //   const sessionService = interpret(
//       //     createSessionMachine({ world, entity: sessionEntity })
//       //   );
//       //   entityServices.set(sessionEntity.id, sessionService);

//       //   const userEntity = userEntityIndex.get(session.user.id);
//       //   if (userEntity) {
//       //     userEntity.sessions.push(sessionId);
//       //   } else {
//       //     const userEntity: UserEntity = {
//       //       id: generateSnowflakeId(),
//       //       userId: session.user.id,
//       //       schema: 'user',
//       //       sessions: [sessionId],
//       //     };
//       //     world.add(userEntity);
//       //     const userService = interpret(
//       //       createUserMachine({ world, entity: userEntity })
//       //     );
//       //     entityServices.set(userEntity.id, userService);
//       //   }
//       // }
//     }),
// });

// const createSessionMachine = (props: {
//   world: World;
//   entity: SessionEntity;
// }) => {
//   return createMachine({
//     id: 'RoomMachine',
//     context: {
//       foo: 'bar',
//     },
//     type: 'parallel',
//     schema: {
//       context: {} as { foo: 'bar' },
//     },
//     states: {
//       Listed: {
//         initial: 'Yes',
//         states: {
//           No: {},
//           Yes: {},
//         },
//       },
//       Visbility: {
//         initial: 'Anyone',
//         states: {
//           Anyone: {},
//           LoggedIn: {},
//           Friends: {},
//         },
//       },
//     },
//   });
// };

// const createUserMachine = (props: { world: World; entity: UserEntity }) => {
//   return createMachine({
//     id: 'RoomMachine',
//     context: {
//       foo: 'bar',
//     },
//     type: 'parallel',
//     schema: {
//       context: {} as { foo: 'bar' },
//     },
//     states: {
//       Listed: {
//         initial: 'Yes',
//         states: {
//           No: {},
//           Yes: {},
//         },
//       },
//       Visbility: {
//         initial: 'Anyone',
//         states: {
//           Anyone: {},
//           LoggedIn: {},
//           Friends: {},
//         },
//       },
//     },
//   });
// };
