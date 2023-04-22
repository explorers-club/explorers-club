// import { Database } from '@explorers-club/database';
// import {
//   createArchetypeIndex,
//   createEntity,
//   generateSnowflakeId,
// } from '@explorers-club/ecs';
// import {
//   ConnectionContext,
//   ConnectionCommand,
//   ConnectionTypeState,
//   Entity,
//   InitializedConnectionContext,
//   SnowflakeId,
//   UserContext,
//   UserEntity,
//   UserCommand,
//   UserTypeState,
// } from '@explorers-club/schema';
// import { assertEventType } from '@explorers-club/utils';
// import { createClient } from '@supabase/supabase-js';
// import { TRPCError } from '@trpc/server';
// import { assign } from '@xstate/immer';
// import { World } from 'miniplex';
// import {
//   ActorRefFrom,
//   createMachine,
//   DoneInvokeEvent,
//   interpret,
//   InterpreterFrom,
//   StateMachine,
//   StateNode,
//   StateSchema,
// } from 'xstate';
// import { createUserMachine } from './entities/user';
// import { world } from './world';

// const supabaseUrl = process.env['SUPABASE_URL'];
// const supabaseJwtSecret = process.env['SUPABASE_JWT_SECRET'];
// const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];
// const supabaseServiceKey = process.env['SUPABASE_SERVICE_KEY'];

// // todo: switch to using zod for parsing
// if (
//   !supabaseUrl ||
//   !supabaseJwtSecret ||
//   !supabaseAnonKey ||
//   !supabaseServiceKey
// ) {
//   throw new Error('missing supabase configuration');
// }

// const [entityByUserId, userEntity$] = createArchetypeIndex(
//   world.with(
//     'id',
//     'schema',
//     'userId',
//     'name',
//     'discriminiator',
//     'position',
//     'session',
//     'connections'
//   ),
//   'userId'
// );

// // const createUserEntity = () => {
// //   const userMachine = createUserMachine({ world });
// //   const userService = interpret(userMachine);
// //   userService.start();
// //   const state = userService.getSnapshot()!;
// //   const now = new Date();

// //   return createEntity({
// //     id: generateSnowflakeId(),
// //     userId: undefined,
// //     schema: 'user',
// //     name: undefined,
// //     discriminator: 0,
// //     state: state.value,
// //     session: {
// //       id: generateSnowflakeId(),
// //       createdAt: now,
// //     },
// //     connections: [
// //       {
// //         id: generateSnowflakeId(),
// //         createdAt: now,
// //         connected: true,
// //       },
// //     ],
// //   } as UserEntity);
// // };

// export function createUserMachine(props: {
//   world: World;
//   entity: Entity;
// }): UserStateMachine {
//   // console.log(world, entity);
//   // return '';
//   return createMachine({
//     id: "UserMachine"
//   })
// }

// type Interpreter = InterpreterFrom<UserStateMachine>;
// const i = {} as Interpreter;

// i.start()
// const state = i.getSnapshot();
// state.matches("Initialized")






// export const createConnectionMachine2 = ({
//   world,
// }: {
//   world: World;
//   entity: Entity;
// }) => {
//   // const { id } = entity;
//   const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//     auth: {
//       persistSession: false,
//     },
//   });

//   const connectionMachine = createMachine<
//     ConnectionContext,
//     ConnectionCommand,
//     ConnectionTypeState
//   >({
//     id: 'ConnectionMachine',
//     initial: 'Unitialized',
//     states: {
//       Unitialized: {
//         on: {
//           INITIALIZE: {
//             target: 'Initializing',
//           },
//         },
//       },
//       Initializing: {
//         invoke: {
//           onDone: {
//             target: 'Initialized',
//             actions: assign<
//               ConnectionContext,
//               DoneInvokeEvent<InitializedConnectionContext>
//             >((context, event) => {
//               context = event.data;
//             }),
//           },
//           onError: 'Error',
//           src: async (context, event) => {
//             assertEventType(event, 'INITIALIZE');

//             const { authTokens, deviceId, initialLocation } = event;

//             let userId: SnowflakeId | undefined = undefined;
//             if (authTokens) {
//               const { data, error } = await supabaseClient.auth.setSession({
//                 access_token: authTokens.accessToken,
//                 refresh_token: authTokens.refreshToken,
//               });

//               if (error) {
//                 throw new TRPCError({
//                   code: 'INTERNAL_SERVER_ERROR',
//                   message: error.message,
//                   cause: error,
//                 });
//               }
//               if (!data.user) {
//                 throw new TRPCError({
//                   code: 'UNAUTHORIZED',
//                   message: 'Not able to fetch user with authTokens',
//                 });
//               }

//               userId = data.user.id;
//             }

//             const connectionId = generateSnowflakeId();
//             const now = new Date();

//             const userMachine = createUserMachine({ world });
//             const userService = interpret(userMachine);
//             userService.start();
//             const state = userService.getSnapshot()!;

//             const [userEntity, userEntity$] = createEntity<UserEntity>({
//               // id: generateSnowflakeId(),
//               userId: undefined,
//               schema: 'user',
//               name: undefined,
//               discriminator: 0,
//               state: state.value,
//               sessionId: generateSnowflakeId(),
//               connections: [
//                 {
//                   id: generateSnowflakeId(),
//                   createdAt: now,
//                   connected: true,
//                 },
//               ],
//             });

//             // const userEntity: UserEntity = {
//             //   id: generateSnowflakeId(),
//             //   userId: undefined,
//             //   schema: 'user',
//             //   name: undefined,
//             //   discriminator: 0,
//             //   session: {
//             //     id: generateSnowflakeId(),
//             //     createdAt: now,
//             //   },
//             //   connections: [
//             //     {
//             //       id: generateSnowflakeId(),
//             //       createdAt: now,
//             //       connected: true,
//             //     },
//             //   ],
//             // };
//             world.add(userEntity);

//             return {
//               id: connectionId,
//               deviceId: deviceId || generateSnowflakeId(),
//               userId,
//               location: initialLocation,
//               mainConnectionId: connectionId,
//               connectionIds: [connectionId],
//               userEntity,
//             } as InitializedConnectionContext;

//             // const userId = supabaseSession.user.id;

//             // // Find or create session for this user
//             // let sessionService = sessionsServicesByUserId.get(userId) satisfies SessionInterpreter | undefined;
//             // let sessionId: SnowflakeId | undefined;
//             // if (!sessionService) {
//             //   sessionService = interpret(
//             //     createSessionMachine({ world })
//             //   );
//             //   sessionService.start();
//             //   sessionService.send({
//             //     type: "INITIALIZE",
//             //     userId: supabaseSession.user.id,
//             //     connectionId: id
//             //   })
//             //   sessionsServicesByUserId.set(userId, sessionService);
//             // } else {
//             //   sessionService.send({ type: "ADD_CONNECTION", connectionId: id })
//             //   sessionId = sessionService.id;
//             // }

//             // const entity: ConnectionEntity = {
//             //   id,
//             //   schema: "connection",
//             //   location,
//             //   deviceId: deviceId || generateSnowflakeId(),
//             //   // sessionId
//             // }
//             // world.add(entity);

//             // return {
//             //   entity,
//             //   supabaseSession,
//             // };
//           },
//         },
//       },
//       Initialized: {},
//       Error: {},
//     },
//   });
//   return connectionMachine;
// };
