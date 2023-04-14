import { Database } from '@explorers-club/database';
import {
  ConnectionCommand,
  ConnectionContext,
  ConnectionEntity,
  ConnectionTypeState,
  Entity,
  InitializedConnectionContext,
} from '@explorers-club/schema';
import { assertEventType, generateRandomString } from '@explorers-club/utils';
import { createClient, Session } from '@supabase/supabase-js';
import { TRPCError } from '@trpc/server';
import { assign } from '@xstate/immer';
import { World } from 'miniplex';
import { createMachine, DoneInvokeEvent } from 'xstate';
import { createEntity, generateSnowflakeId } from '../ecs';
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
                >((context, { data }) => {
                  context.authTokens = data.authTokens;
                  context.location = data.location;
                  context.deviceId = data.deviceId;
                }),
              },
              onError: 'False',
              src: async (context, event) => {
                assertEventType(event, 'INITIALIZE');

                const { authTokens, initialLocation } = event;

                let supabaseSession: Session;
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
                  if (!data.session) {
                    throw new TRPCError({
                      code: 'UNAUTHORIZED',
                      message:
                        'Not able to get supabase session with authTokens',
                    });
                  }
                  supabaseSession = data.session;
                } else {
                  const { data, error } = await supabaseClient.auth.signUp({
                    email: `anon-${generateRandomString()}@explorers.club`,
                    password: `${generateRandomString()}33330`,
                  });
                  if (error) {
                    throw new TRPCError({
                      code: 'INTERNAL_SERVER_ERROR',
                      message: error.message,
                      cause: error,
                    });
                  }

                  if (!data.session) {
                    throw new TRPCError({
                      code: 'INTERNAL_SERVER_ERROR',
                      message: 'Expected session but was missing',
                    });
                  }
                  supabaseSession = data.session;
                  await supabaseClient.auth.setSession({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                  });
                }

                const userId = supabaseSession.user.id;
                let sessionEntity = sessionByUserId.get(userId);
                if (sessionEntity) {
                  connectionEntity.sessionId = sessionEntity.id;
                } else {
                  const { createEntity } = await import('../ecs');
                  sessionEntity = createEntity({
                    schema: 'session',
                  });
                  connectionEntity.sessionId = sessionEntity.id;
                }

                const deviceId = event.deviceId || generateSnowflakeId();

                return {
                  authTokens: {
                    accessToken: supabaseSession.access_token,
                    refreshToken: supabaseSession.refresh_token,
                  },
                  deviceId,
                  location: initialLocation,
                } satisfies InitializedConnectionContext;
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
