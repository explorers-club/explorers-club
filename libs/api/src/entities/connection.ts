import { Database } from '@explorers-club/database';
import {
  ConnectionCommand,
  ConnectionContext,
  ConnectionEntity,
  ConnectionTypeState,
  Entity,
  InitializedConnectionContext,
  SessionEntity,
} from '@explorers-club/schema';
import { assertEventType, generateRandomString } from '@explorers-club/utils';
import { Session, createClient } from '@supabase/supabase-js';
import { TRPCError } from '@trpc/server';
import { assign } from '@xstate/immer';
import { World } from 'miniplex';
import { DoneInvokeEvent, createMachine } from 'xstate';
import { generateSnowflakeId } from '../ecs';
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

const [sessionsByUserId] = createSchemaIndex(world, 'session', 'userId');

export const createConnectionMachine = ({
  world,
  entity,
}: {
  world: World;
  entity: Entity;
}) => {
  const connectionEntity = entity as ConnectionEntity;

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
                  context.supabaseClient = data.supabaseClient;
                }),
              },
              onError: 'False',
              src: async (context, event) => {
                assertEventType(event, 'INITIALIZE');

                const { authTokens, initialLocation } = event;

                const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
                  auth: {
                    persistSession: false,
                  },
                });

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
                let sessionEntity = sessionsByUserId.get(userId);
                if (sessionEntity) {
                  connectionEntity.sessionId = sessionEntity.id;
                } else {
                  const { createEntity } = await import('../ecs');
                  sessionEntity = createEntity<SessionEntity>({
                    schema: 'session',
                    userId,
                  });
                  connectionEntity.sessionId = sessionEntity.id;
                  world.add(sessionEntity);
                }

                const deviceId = event.deviceId || generateSnowflakeId();

                return {
                  authTokens: {
                    accessToken: supabaseSession.access_token,
                    refreshToken: supabaseSession.refresh_token,
                  },
                  deviceId,
                  location: initialLocation,
                  supabaseClient
                } satisfies InitializedConnectionContext;
              },
            },
          },
          True: {},
        },
      },
    },
  });
  return connectionMachine;
};
