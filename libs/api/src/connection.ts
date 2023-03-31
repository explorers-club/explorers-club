import { Database } from "@explorers-club/database";
import { generateSnowflakeId } from "@explorers-club/ecs";
import { ConnectionContext, ConnectionEntity, ConnectionEvent, ConnectionTypeState, SessionInterpreter, SnowflakeId, UserId } from "@explorers-club/schema";
import { assertEventType, generateRandomString } from "@explorers-club/utils";
import { createClient, Session } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { World } from "miniplex";
import { assign, createMachine, interpret } from "xstate";
import { createSessionMachine } from "./session";

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

const sessionsServicesByUserId = new Map<UserId, SessionInterpreter>();

export const createConnectionMachine = ({
  world,
}: {
  world: World;
}) => {
  // const { id } = entity;
  const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  const connectionMachine = createMachine<
    ConnectionContext,
    ConnectionEvent,
    ConnectionTypeState
  >({
    id: "ConnectionMachine",
    context: {
      supabaseClient,
      // deviceService: undefined,
      // sessionService: undefined,
      // playerService: undefined,
    },
    states: {
      Unitialized: {
        on: {
          INITIALIZE: {
            target: 'Initializing',
          },
        },
      },
      Initializing: {
        invoke: {
          onDone: {
            target: 'Initialized',
            actions: assign({
              entity: (_, event) => event.data.entity,
              supabaseSession: (_, event) => event.data.supabaseSession,
              location: (_, event) => event.data.location,
            })
          },
          onError: 'Error',
          src: async (context, event) => {
            const id = generateSnowflakeId();
            assertEventType(event, "INITIALIZE");
            const { deviceId, authTokens, initialLocation: location } = event;
            let supabaseSession: Session;

            // Get our user from supabase using the auth tokens
            if (authTokens) {
              const { data, error } = await supabaseClient.auth.setSession({
                access_token: authTokens.accessToken,
                refresh_token: authTokens.refreshToken,
              });

              if (error) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: error.message,
                  cause: error,
                });
              }

              if (!data.session) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: 'Unable to start session',
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

            // Find or create session for this user
            let sessionService = sessionsServicesByUserId.get(userId) satisfies SessionInterpreter | undefined;
            let sessionId: SnowflakeId | undefined;
            if (!sessionService) {
              sessionService = interpret(
                createSessionMachine({ world })
              );
              sessionService.start();
              sessionService.send({
                type: "INITIALIZE",
                userId: supabaseSession.user.id,
                connectionId: id
              })
              sessionsServicesByUserId.set(userId, sessionService);
            } else {
              sessionService.send({ type: "ADD_CONNECTION", connectionId: id })
              sessionId = sessionService.id;
            }

            const entity: ConnectionEntity = {
              id,
              schema: "connection",
              location,
              deviceId: deviceId || generateSnowflakeId(),
              // sessionId
            }
            world.add(entity);

            return {
              entity,
              supabaseSession,
            };
          },
        },
      },
      Initialized: {},
      Error: {},
    },
  });
  return connectionMachine;
};