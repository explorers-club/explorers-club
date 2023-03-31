import { Database } from '@explorers-club/database';
import { MakeRequired } from '@explorers-club/utils';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { InterpreterFrom, StateMachine, StateValue } from 'xstate';
import { z } from 'zod';
import { CodebreakersState } from '../@types/generated/CodebreakersState';
import { DiffusionaryState } from '../@types/generated/DiffusionaryState';
import { LittleVigilanteState } from '../@types/generated/LittleVigilanteState';
import { TriviaJamState } from '../@types/generated/TriviaJamState';

export const ClubRoomIdSchema = z.custom<`club-${string}`>((val) => {
  return /^club-\w+$/.test(val as string);
});
export const TriviaJamRoomIdSchema = z.custom<`trivia_jam-${string}`>((val) => {
  return /^trivia_jam-\w+$/.test(val as string);
});
export const CodebreakersRoomIdSchema = z.custom<`codebreakers-${string}`>(
  (val) => {
    return /^codebreakers-\w+$/.test(val as string);
  }
);
export const DiffusionaryRoomIdSchema = z.custom<`diffusionary-${string}`>(
  (val) => {
    return /^diffusionary-\w+$/.test(val as string);
  }
);
export const LittleVigilanteRoomIdSchema =
  z.custom<`little_vigilante-${string}`>((val) => {
    return /^little_vigilante-\w+$/.test(val as string);
  });

export type ClubRoomId = z.infer<typeof ClubRoomIdSchema>;
export type TriviaJamRoomId = z.infer<typeof TriviaJamRoomIdSchema>;
export type DiffusionaryRoomId = z.infer<typeof DiffusionaryRoomIdSchema>;
export type LittleVigilanteRoomId = z.infer<typeof LittleVigilanteRoomIdSchema>;
export type CodebreakersRoomId = z.infer<typeof CodebreakersRoomIdSchema>;

export type GameState =
  | TriviaJamState
  | DiffusionaryState
  | LittleVigilanteState
  | CodebreakersState;

export type GameRoomId =
  | TriviaJamRoomId
  | DiffusionaryRoomId
  | LittleVigilanteRoomId
  | CodebreakersRoomId;

export type RoomId = ClubRoomId | GameRoomId;

export type ClubMetadata = {
  clubName: string;
};

export const TriviaJamConfigSchema = z
  .object({
    gameId: z.literal('trivia_jam').default('trivia_jam'),
    minPlayers: z.literal(3).default(3),
    maxPlayers: z.number().max(250).default(250),
    questionSetEntryId: z.string().default('dSX6kC0PNliXTl7qHYJLH'),
  })
  .required();

export type TriviaJamConfig = z.infer<typeof TriviaJamConfigSchema>;

export const DiffusionaryConfigSchema = z
  .object({
    gameId: z.literal('diffusionary').default('diffusionary'),
    minPlayers: z.literal(4).default(4),
    maxPlayers: z.number().int().min(4).max(10).default(10),
  })
  .required();

export type DiffusionaryConfig = z.infer<typeof DiffusionaryConfigSchema>;

export const LittleVigilanteConfigSchema = z
  .object({
    gameId: z.literal('little_vigilante').default('little_vigilante'),
    minPlayers: z.literal(4).default(4),
    maxPlayers: z.number().int().min(4).max(10).default(10),
    discussionTimeSeconds: z.number().int().min(10).max(600).default(180),
    roundsToPlay: z.number().int().min(1).max(999).default(5),
    votingTimeSeconds: z.number().int().default(20),
    rolesToExclude: z.array(z.string()).default([]),
  })
  .required();

export type LittleVigilanteConfig = z.infer<typeof LittleVigilanteConfigSchema>;

export const CodebreakersConfigSchema = z
  .object({
    gameId: z.literal('codebreakers').default('codebreakers'),
    minPlayers: z.literal(4).default(4),
    maxPlayers: z.number().int().min(4).max(10).default(10),
  })
  .required();

export type CodebreakersConfig = z.infer<typeof CodebreakersConfigSchema>;

export const SnowflakeIdSchema = z.string();
export type SnowflakeId = z.infer<typeof SnowflakeIdSchema>;

export const UserIdSchema = SnowflakeIdSchema;
export type UserId = z.infer<typeof UserIdSchema>;
export const ECEpochTimestampSchema = z.number();
export type ECEpochTimestamp = z.infer<typeof ECEpochTimestampSchema>;

// const AnonymousRoleLiteralType = z.literal('anonymous');
// const AuthenticatedRoleLiteralType = z.literal('authenticated');

// const RolesSchema = z.union([
//   AnonymousRoleLiteralType,
//   AuthenticatedRoleLiteralType,
// ]);

// const GroupsSchema = z.enum(['anonymous', 'authenticated']);

// const UserSchema = z.object({
//   id: UserIdSchema,
//   schema: z.literal('user'),
//   groups: GroupsSchema,
//   roles: z.array(z.string()),
// });

export const ClubNameSchema = z.string();

export const PlayerNameSchema = z.string();

const GameIdSchema = z.enum(['little_vigilante', 'codebreakers']);

const GameInstanceIdSchema = z.string();

const ClientIdSchema = SnowflakeIdSchema;

const ClientSchema = z.object({
  id: ClientIdSchema,
});

const RoomIdSchema = ClubNameSchema;

const StateValueSchema: z.ZodType<StateValue> = z.union([
  z.string(),
  z.record(z.lazy(() => StateValueSchema)),
]);

const StagingRoomSchemaTypeLiteral = z.literal('staging_room');
const LittleVigilanteRoomSchemaTypeLiteral = z.literal('little_vigilante_room');
const UserSchemaTypeLiteral = z.literal('user');
const PlayerSchemaTypeLiteral = z.literal('player');
const SessionSchemaTypeLiteral = z.literal('session');
const ConnectionSchemaTypeLiteral = z.literal('connection');
const DeviceSchemaTypeLiteral = z.literal('device');

export const SchemaLiteralsSchema = z.union([
  StagingRoomSchemaTypeLiteral,
  PlayerSchemaTypeLiteral,
  LittleVigilanteRoomSchemaTypeLiteral,
  ConnectionSchemaTypeLiteral,
  // UserSchemaTypeLiteral,
  // SessionSchemaTypeLiteral,
  // DeviceSchemaTypeLiteral,
]);
export type SchemaType = z.infer<typeof SchemaLiteralsSchema>;

const EntityBaseSchema = z.object({
  id: SnowflakeIdSchema,
  states: z.array(z.string()).optional(),
  schema: SchemaLiteralsSchema,
  children: z.array(SnowflakeIdSchema).optional(),
});
export type EntityBase = z.infer<typeof EntityBaseSchema>;

export const StagingRoomEntitySchema = EntityBaseSchema.extend({
  indexKey: z.literal('roomName'),
  roomName: ClubNameSchema,
  schema: StagingRoomSchemaTypeLiteral,
  playersIds: z.array(z.string()),
});
export type StagingRoomEntity = z.infer<typeof StagingRoomEntitySchema>;

export const LittleVigilanteRoomEntitySchema = EntityBaseSchema.extend({
  roomName: ClubNameSchema,
  schema: LittleVigilanteRoomSchemaTypeLiteral,
  playersIds: z.array(z.string()),
});

const RoomEntitySchema = z.union([
  StagingRoomEntitySchema,
  LittleVigilanteRoomEntitySchema,
]);
export type RoomEntity = z.infer<typeof RoomEntitySchema>;

const DeviceSchema = z.object({
  deviceId: z.string(),
  lastHeartbeatAt: z.date(),
  currentLocation: z.string().url(),
  connected: z.boolean(),
  supabaseSessionId: z.string(),
});

const DeviceIdSchema = z.string();

const ConnectionIdSchema = z.string();
const SessionIdSchema = z.string();

const ConnectionEntitySchema = EntityBaseSchema.extend({
  schema: ConnectionSchemaTypeLiteral,
  location: z.string().url(),
  deviceId: DeviceIdSchema,
  // sessionId: SessionIdSchema.optional(),
});
export type ConnectionEntity = z.infer<typeof ConnectionEntitySchema>;

const DeviceEntitySchema = EntityBaseSchema.extend({
  schema: DeviceSchemaTypeLiteral,
  supabaseSessionId: z.string(),
  connectedAt: z.date(),
});
export type DeviceEntity = z.infer<typeof DeviceEntitySchema>;

const InitializeTypeLiteral = z.literal('INITIALIZE');

const NavigateEventSchema = z.object({
  type: z.literal('NAVIGATE'),
  location: z.string().url(),
});
type NavigateEvent = z.infer<typeof NavigateEventSchema>;

const HeartbeatEventSchema = z.object({
  type: z.literal('HEARTBEAT'),
});
type HeartbeatEvent = z.infer<typeof HeartbeatEventSchema>;

const InitializeEventBaseSchema = z.object({
  type: InitializeTypeLiteral,
  id: SnowflakeIdSchema.optional(),
});
type InitializeEntityEvent = z.infer<typeof InitializeEventBaseSchema>;

export type DeviceMachine = StateMachine<
  { entity: DeviceEntity },
  any,
  InitializeEntityEvent,
  any
>;
export type DeviceInterpreter = InterpreterFrom<DeviceMachine>;

const SessionEntitySchema = EntityBaseSchema.extend({
  schema: SessionSchemaTypeLiteral,
  connectionIds: z.array(ConnectionIdSchema),
  userId: SnowflakeIdSchema,
  startedAt: z.date(),
});
export type SessionEntity = z.infer<typeof SessionEntitySchema>;

type DeviceId = string;

// export const SessionContextSchema = z.object({
//   supabaseClient: SessionEntitySchema,
// });
// export type SessionContext = z.infer<typeof SessionContextSchema>;

// export const SessionEventSchema = z.object({
//   type: z.literal('HEARTBEAT'),
// });

export type ConnectionContext = {
  supabaseClient: SupabaseClient<Database>;
  entity?: ConnectionEntity;
  supabaseSession?: Session;
  sessionService?: SessionInterpreter;
  deviceService?: DeviceInterpreter;
  location?: string;
};

export type ConnectionTypeState = {
  value: 'Initialized';
  context: MakeRequired<
    ConnectionContext,
    | 'entity'
    | 'sessionService'
    | 'deviceService'
    | 'location'
    | 'supabaseSession'
  >;
};

export const ConnectionInitializeInputSchema = z.object({
  deviceId: SnowflakeIdSchema.optional(),
  initialLocation: z.string(),
  authTokens: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .optional(),
});

export const InitializeConnectionEventSchema = InitializeEventBaseSchema.merge(
  ConnectionInitializeInputSchema
);

type InitializeConnectionEvent = z.infer<
  typeof InitializeConnectionEventSchema
>;

export type ConnectionEvent =
  | InitializeConnectionEvent
  | NavigateEvent
  | HeartbeatEvent;

// export type SessionMachineSchema = MachineSchema<SessionContext, SessionEvent>;
export type ConnectionMachine = StateMachine<
  ConnectionContext,
  any,
  ConnectionEvent,
  ConnectionTypeState
>;
export type ConnectionInterpreter = InterpreterFrom<ConnectionMachine>;

type InitializeSessionEntityEvent = InitializeEntityEvent & {
  userId: SnowflakeId;
  connectionId: SnowflakeId;
};

type AddConnectionEvent = { type: 'ADD_CONNECTION'; connectionId: SnowflakeId };

export type SessionEvent = InitializeSessionEntityEvent | AddConnectionEvent;

export type SessionContext = {
  entity?: SessionEntity;
};

export type SessionTypeState = {
  value: 'Initialized';
  context: MakeRequired<SessionContext, 'entity'>;
};

export type SessionMachine = StateMachine<
  SessionContext,
  any,
  SessionEvent,
  SessionTypeState
>;
export type SessionInterpreter = InterpreterFrom<SessionMachine>;

export const UserEntitySchema = EntityBaseSchema.extend({
  schema: UserSchemaTypeLiteral,
  userId: SnowflakeIdSchema,
  name: PlayerNameSchema.optional(),
  discriminator: z.string().optional(),
  sessions: z.array(SnowflakeIdSchema),
});
export type UserEntity = z.infer<typeof UserEntitySchema>;

export const PlayerEntitySchema = EntityBaseSchema.extend({
  schema: PlayerSchemaTypeLiteral,
  userId: SnowflakeIdSchema,
  name: PlayerNameSchema.optional(),
  position: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
  }),
});
export type PlayerEntity = z.infer<typeof PlayerEntitySchema>;

const Vector2DSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const PlayerEventSchema = z.union([
  z.object({
    type: z.literal('SET_NAME'),
  }),
  z.object({
    type: z.literal('MOVE'),
    velocity: Vector2DSchema,
  }),
]);

export const EntitySchema = z.union([
  ConnectionEntitySchema,
  RoomEntitySchema,
  PlayerEntitySchema,
]);

export function isEntity(entity: unknown): entity is Entity {
  return EntitySchema.safeParse(entity).success;
}

export type Entity = z.infer<typeof EntitySchema>;

export type EntityService = ConnectionInterpreter | SessionInterpreter;

const RoomEventSchema = z.union([
  z.object({
    type: z.literal('JOIN'),
  }),
  z.object({
    type: z.literal('LEAVE'),
  }),
]);

const ConnectionEventSchema = z.union([
  z.object({
    type: z.literal('RECONNECT'),
  }),
  z.object({
    type: z.literal('DISCONNECT'),
  }),
]);

export const EntityEventSchema = z.union([
  ConnectionEventSchema,
  RoomEventSchema,
  PlayerEventSchema,
]);
