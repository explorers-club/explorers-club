// See explanation at https://trpc.io/docs/context#inner-and-outer-context
// Inner context is context which doesn't depend on the request (e.g. DB)
import { Database } from '@explorers-club/database';
import { ConnectionEntity, SnowflakeId } from '@explorers-club/schema';
import { createClient } from '@supabase/supabase-js';
import { type inferAsyncReturnType } from '@trpc/server';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { createEntity } from './ecs';
import { world } from './world';

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseJwtSecret = process.env['SUPABASE_JWT_SECRET'];
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];
const supabaseServiceKey = process.env['SUPABASE_SERVICE_KEY'];

const instanceId = uuidv4();

// todo: switch to using zod for parsing
if (
  !supabaseUrl ||
  !supabaseJwtSecret ||
  !supabaseAnonKey ||
  !supabaseServiceKey
) {
  throw new Error('missing supabase configuration');
}

const supabaseAdminClient = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
);

supabaseAdminClient
  .from('server_instances')
  .insert({ id: instanceId })
  .then(() => {
    console.log('Service Instance Registered', instanceId);
  });

type CreateContextOptions = {
  socket: WebSocket;
  connectionEntity: ConnectionEntity;
  instanceId: SnowflakeId;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (ctx: CreateContextOptions) => {
  return ctx;
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: {
  req: IncomingMessage;
  res: WebSocket;
}) => {
  const socket = opts.res;

  const connectionEntity = createEntity<ConnectionEntity>({
    schema: 'connection',
    instanceId,
  });
  world.add(connectionEntity);

  const contextInner = await createContextInner({
    connectionEntity,
    socket,
    instanceId,
  });

  return {
    ...contextInner,
    req: opts.req,
    socket: opts.res,
  };
};

export type Context = inferAsyncReturnType<typeof createContextInner>;
