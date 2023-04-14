import { Database } from '@explorers-club/database';
import {
  ConnectionCommand,
  ConnectionContext,
  ConnectionEntity,
  ConnectionTypeState,
  Entity,
  InitializedConnectionContext,
} from '@explorers-club/schema';
import { assertEventType } from '@explorers-club/utils';
import { createClient } from '@supabase/supabase-js';
import { TRPCError } from '@trpc/server';
import { assign } from '@xstate/immer';
import { World } from 'miniplex';
import { createMachine, DoneInvokeEvent } from 'xstate';
import { createSchemaIndex } from '../indices';
import { world } from '../world';

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseJwtSecret = process.env['SUPABASE_JWT_SECRET'];
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];
const supabaseServiceKey = process.env['SUPABASE_SERVICE_KEY'];

// todo: switch to using zod for parsing
if (
  !supabaseUrl ||
  !supabaseJwtSecret ||
  !supabaseAnonKey ||
  !supabaseServiceKey
) {
  throw new Error('missing supabase configuration');
}

const [sessionByUserId] = createSchemaIndex(world, 'session', 'userId');

export const createConnectionMachine = ({
  world,
  entity,
}: {
  world: World;
  entity: Entity;
}) => {
  const connectionEntity = entity as ConnectionEntity;
  // const { id } = entity;
  const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  const connectionMachine = createMachine<
    ConnectionContext,
    ConnectionCommand,
    ConnectionTypeState
  >({
    id: 'ConnectionMachine',
    type: 'parallel',
    context: {
      deviceId: undefined,
      authTokens: undefined,
      location: undefined,
    },
    states: {
      Initialized: {
        initial: 'False',
        states: {
          False: {
            on: {
              INITIALIZE: {
                target: 'Initializing',
              },
            },
          },
          Initializing: {
            invoke: {
              onDone: {
                target: 'True',
                actions: assign<
                  ConnectionContext,
                  DoneInvokeEvent<InitializedConnectionContext>
                >((context, event) => {
                  context = event.data;
                }),
              },
              onError: 'False',
              src: async (context, event) => {
                assertEventType(event, 'INITIALIZE');

                const { authTokens, deviceId, initialLocation } = event;

                if (authTokens) {
                  const { data, error } = await supabaseClient.auth.setSession({
                    access_token: authTokens.accessToken,
                    refresh_token: authTokens.refreshToken,
                  });

                  if (error) {
                    throw new TRPCError({
                      code: 'INTERNAL_SERVER_ERROR',
                      message: error.message,
                      cause: error,
                    });
                  }
                  if (!data.user) {
                    throw new TRPCError({
                      code: 'UNAUTHORIZED',
                      message: 'Not able to fetch user with authTokens',
                    });
                  }
                  const userId = data.user.id;
                  const session = sessionByUserId.get(userId);
                  if (session) {
                    connectionEntity.sessionId = session.id;
                  }
                }

                if (!connectionEntity.sessionId) {
                  const { createEntity } = await import('../ecs');
                  const sessionEntity = createEntity({
                    schema: 'session',
                  });
                  world.add(sessionEntity);
                  connectionEntity.sessionId = sessionEntity.id;
                }

                const result = {
                  ...context,
                  authTokens,
                  deviceId,
                  location: initialLocation,
                } as InitializedConnectionContext;
                console.log(result);
                return result;
              },
            },
          },
          True: {},
        },
      },
      // Unitialized: {
      //   on: {
      //     // INITIALIZE: {
      //     //   target: 'Initializing',
      //     // },
      //   },
      // },
      // Initializing: {
      //   invoke: {
      //     onDone: {
      //       target: 'Initialized',
      //       actions: assign<
      //         ConnectionContext,
      //         DoneInvokeEvent<InitializedConnectionContext>
      //       >((context, event) => {
      //         context = event.data;
      //       }),
      //     },
      //     onError: 'Error',
      //     src: async (context, event) => {
      //       assertEventType(event, 'INITIALIZE');

      //       const { authTokens, deviceId, initialLocation } = event;

      //       let userId: SnowflakeId | undefined = undefined;
      //       if (authTokens) {
      //         const { data, error } = await supabaseClient.auth.setSession({
      //           access_token: authTokens.accessToken,
      //           refresh_token: authTokens.refreshToken,
      //         });

      //         if (error) {
      //           throw new TRPCError({
      //             code: 'INTERNAL_SERVER_ERROR',
      //             message: error.message,
      //             cause: error,
      //           });
      //         }
      //         if (!data.user) {
      //           throw new TRPCError({
      //             code: 'UNAUTHORIZED',
      //             message: 'Not able to fetch user with authTokens',
      //           });
      //         }

      //         userId = data.user.id;
      //       }

      //       const connectionId = generateSnowflakeId();
      //       const now = new Date();

      //       // const userEntity = createEntity("user")

      //       // const userMachine = createUserMachine({ world });
      //       // const userService = interpret(userMachine);
      //       // userService.start();
      //       // const state = userService.getSnapshot()!;

      //       // const [userEntity, userEntity$] = createEntity<UserEntity>({
      //       //   // id: generateSnowflakeId(),
      //       //   userId: undefined,
      //       //   schema: 'user',
      //       //   name: undefined,
      //       //   discriminator: 0,
      //       //   state: state.value,
      //       //   sessionId: generateSnowflakeId(),
      //       //   connections: [
      //       //     {
      //       //       id: generateSnowflakeId(),
      //       //       createdAt: now,
      //       //       connected: true,
      //       //     },
      //       //   ],
      //       // });

      //       // const userEntity: UserEntity = {
      //       //   id: generateSnowflakeId(),
      //       //   userId: undefined,
      //       //   schema: 'user',
      //       //   name: undefined,
      //       //   discriminator: 0,
      //       //   session: {
      //       //     id: generateSnowflakeId(),
      //       //     createdAt: now,
      //       //   },
      //       //   connections: [
      //       //     {
      //       //       id: generateSnowflakeId(),
      //       //       createdAt: now,
      //       //       connected: true,
      //       //     },
      //       //   ],
      //       // };
      //       // world.add(userEntity);

      //       // return {
      //       //   id: connectionId,
      //       //   deviceId: deviceId || generateSnowflakeId(),
      //       //   userId,
      //       //   location: initialLocation,
      //       //   mainConnectionId: connectionId,
      //       //   connectionIds: [connectionId],
      //       //   userEntity,
      //       // } as InitializedConnectionContext;

      //       // const userId = supabaseSession.user.id;

      //       // // Find or create session for this user
      //       // let sessionService = sessionsServicesByUserId.get(userId) satisfies SessionInterpreter | undefined;
      //       // let sessionId: SnowflakeId | undefined;
      //       // if (!sessionService) {
      //       //   sessionService = interpret(
      //       //     createSessionMachine({ world })
      //       //   );
      //       //   sessionService.start();
      //       //   sessionService.send({
      //       //     type: "INITIALIZE",
      //       //     userId: supabaseSession.user.id,
      //       //     connectionId: id
      //       //   })
      //       //   sessionsServicesByUserId.set(userId, sessionService);
      //       // } else {
      //       //   sessionService.send({ type: "ADD_CONNECTION", connectionId: id })
      //       //   sessionId = sessionService.id;
      //       // }

      //       // const entity: ConnectionEntity = {
      //       //   id,
      //       //   schema: "connection",
      //       //   location,
      //       //   deviceId: deviceId || generateSnowflakeId(),
      //       //   // sessionId
      //       // }
      //       // world.add(entity);

      //       // return {
      //       //   entity,
      //       //   supabaseSession,
      //       // };
      //     },
      //   },
      // },
      // Initialized: {},
      // Error: {},
    },
  });
  return connectionMachine;
};
