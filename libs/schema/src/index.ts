/* eslint-disable @typescript-eslint/ban-types */
import { IndexByType, MakeRequired } from '@explorers-club/utils';
import {
  AnyEventObject,
  InterpreterFrom,
  StateFrom,
  StateMachine,
  StateSchema,
  StateValue,
} from 'xstate';
import { z, ZodRawShape } from 'zod';
import { CodebreakersState } from '../@types/generated/CodebreakersState';
import { DiffusionaryState } from '../@types/generated/DiffusionaryState';
import { LittleVigilanteState } from '../@types/generated/LittleVigilanteState';
import { TriviaJamState } from '../@types/generated/TriviaJamState';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@explorers-club/database';

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
export type AnyStateValue = z.infer<typeof StateValueSchema>;

const StagingRoomSchemaTypeLiteral = z.literal('staging_room');
const LittleVigilanteRoomSchemaTypeLiteral = z.literal('little_vigilante_room');
const UserSchemaTypeLiteral = z.literal('user');
const PlayerSchemaTypeLiteral = z.literal('player');
const SessionSchemaTypeLiteral = z.literal('session');
const ConnectionSchemaTypeLiteral = z.literal('connection');
const RoomSchemaTypeLiteral = z.literal('room');
const DeviceSchemaTypeLiteral = z.literal('device');

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const SchemaLiteralsSchema = z.union([
  UserSchemaTypeLiteral,
  RoomSchemaTypeLiteral,
  SessionSchemaTypeLiteral,
  ConnectionSchemaTypeLiteral,
  // StagingRoomSchemaTypeLiteral,
  // LittleVigilanteRoomSchemaTypeLiteral,
  // UserSchemaTypeLiteral,
  // SessionSchemaTypeLiteral,
  // DeviceSchemaTypeLiteral,
]);
export type SchemaType = z.infer<typeof SchemaLiteralsSchema>;

// Define a generic schema for the store
const StoreSchema = <State, Event extends { type: string }>(
  stateSchema: z.ZodSchema<State>,
  eventSchema: z.ZodSchema<Event>
) => {
  return z.object({
    id: z.string(),
    subscribe: z
      .function()
      .args(z.function().args().returns(z.void()))
      .returns(z.function().returns(z.void())),
    send: z.function().args(eventSchema).returns(z.void()),
    getSnapshot: z.function().returns(stateSchema),
  });
};

// Define separate Zod schemas for each event type
const DisconnectEventSchema = z.object({ type: z.literal('DISCONNECT') });
const ReconnectEventSchema = z.object({ type: z.literal('RECONNECT') });

// Create a union schema that combines the event schemas
const ConnectionEventSchema = z.union([
  DisconnectEventSchema,
  ReconnectEventSchema,
]);

// Define the base Event type with a "type" string parameter
// export const EventBaseSchema = z.object({
//   type: z.string(),
// });
// export type EventBase = z.infer<typeof EventBaseSchema>;

// Define a custom Zod schema for the send function
// const SendFunctionSchema = z.lazy(() =>
//   z.function().args(EventBaseSchema).returns(z.void())
// );

// const SubscribeFunctionSchema = z
//   .function()
//   .args(z.function().args().returns(z.void()))
//   .returns(z.function().args().returns(z.void()));

// const ConnectionStoreSchema = StoreSchema(
//   ConnectionStateSchema,
//   ConnectionEventSchema
// );

// const EntityBaseSchema = z.object({
//   id: SnowflakeIdSchema,
//   states: z.array(z.string()).optional(),
//   schema: SchemaLiteralsSchema,
//   children: z.array(SnowflakeIdSchema).optional(),
//   send: SendFunctionSchema,
//   subscribe: SubscribeFunctionSchema,
// });
// export type EntityBase = z.infer<typeof EntityBaseSchema>;

// Define a custom Zod schema for the send function
const SendFunctionSchema = <TEvent extends AnyEventObject>(
  eventSchema: z.ZodSchema<TEvent>
) => z.function().args(eventSchema).returns(z.void());

const CallbackFunctionSchema = <TCommand extends AnyEventObject>(
  commandSchema: z.ZodSchema<TCommand>
) => z.function().args(EntityEventSchema(commandSchema)).returns(z.void());

const EntityBaseSchema = <
  TEntity extends ZodRawShape,
  TCommand extends AnyEventObject,
  TContext,
  TStateSchema
>(
  entitySchema: z.ZodObject<TEntity>,
  commandSchema: z.ZodSchema<TCommand>,
  contextSchema: z.ZodSchema<TContext>,
  stateValueSchema: z.ZodSchema<TStateSchema>
) =>
  entitySchema.merge(
    z.object({
      id: SnowflakeIdSchema,
      children: z.array(SnowflakeIdSchema).optional(),
      send: SendFunctionSchema(commandSchema),
      states: stateValueSchema,
      context: contextSchema,
      command: commandSchema,
      subscribe: z
        .function()
        .args(CallbackFunctionSchema(commandSchema))
        .returns(z.function().returns(z.void())), // The subscribe function returns an unsubscribe function
    })
  );

// const StagingRoomContextSchema = z.object({
//   foo: z.string(),
// });

// // Define event schemas for each entity type
// const StagingRoomCommandSchema = z.object({
//   type: z.literal('STAGING_ROOM_EVENT'),
//   data: z.string(),
// });
// type StagingRoomCommand = z.infer<typeof StagingRoomCommandSchema>;

// const LittleVigilanteRoomContextSchema = z.object({
//   foo: z.string(),
// });

// const LittleVigilanteRoomCommandSchema = z.object({
//   type: z.literal('LITTLE_VIGILANTE_ROOM_EVENT'),
//   data: z.string(),
// });
// type LittleVigilanteRoomCommand = z.infer<
//   typeof LittleVigilanteRoomCommandSchema
// >;

// Update entity schema definitions
// export const StagingRoomEntitySchema = EntityBaseSchema(
//   z.object({
//     indexKey: z.literal('roomName'),
//     roomName: ClubNameSchema,
//     schema: StagingRoomSchemaTypeLiteral,
//     playersIds: z.array(z.string()),
//   }),
//   StagingRoomCommandSchema,
//   StagingRoomContextSchema
// );

// export type StagingRoomEntity = z.infer<typeof StagingRoomEntitySchema>;

// export const LittleVigilanteRoomEntitySchema = EntityBaseSchema(
//   z.object({
//     roomName: ClubNameSchema,
//     schema: LittleVigilanteRoomSchemaTypeLiteral,
//     playersIds: z.array(z.string()),
//   }),
//   LittleVigilanteRoomCommandSchema,
//   LittleVigilanteRoomContextSchema
// );

// const DeviceSchema = z.object({
//   deviceId: z.string(),
//   lastHeartbeatAt: z.date(),
//   currentLocation: z.string().url(),
//   connected: z.boolean(),
//   supabaseSessionId: z.string(),
// });

const DeviceIdSchema = z.string().uuid();

const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

// const ConnectionIdSchema = z.string();
// const SessionIdSchema = z.string();

// const ConnectionEntitySchema = EntityBaseSchema.extend({
//   schema: ConnectionSchemaTypeLiteral,
//   location: z.string().url(),
//   deviceId: DeviceIdSchema,
//   // sessionId: SessionIdSchema.optional(),
// });
// export type ConnectionEntity = z.infer<typeof ConnectionEntitySchema>;

// const DeviceEntitySchema = EntityBaseSchema.extend({
//   schema: DeviceSchemaTypeLiteral,
//   supabaseSessionId: z.string(),
//   connectedAt: z.date(),
// });
// export type DeviceEntity = z.infer<typeof DeviceEntitySchema>;

// const InitializeTypeLiteral = z.literal('INITIALIZE');

// const NavigateEventSchema = z.object({
//   type: z.literal('NAVIGATE'),
//   location: z.string().url(),
// });
// type NavigateEvent = z.infer<typeof NavigateEventSchema>;

// const HeartbeatEventSchema = z.object({
//   type: z.literal('HEARTBEAT'),
// });
// type HeartbeatEvent = z.infer<typeof HeartbeatEventSchema>;

// const InitializeEventBaseSchema = z.object({
//   type: InitializeTypeLiteral,
//   id: SnowflakeIdSchema.optional(),
// });
// type InitializeEntityEvent = z.infer<typeof InitializeEventBaseSchema>;

// export type DeviceMachine = StateMachine<
//   { entity: DeviceEntity },
//   any,
//   InitializeEntityEvent,
//   any
// >;
// export type DeviceInterpreter = InterpreterFrom<DeviceMachine>;

// const SessionEntitySchema = EntityBaseSchema.extend({
//   schema: SessionSchemaTypeLiteral,
//   connectionIds: z.array(ConnectionIdSchema),
//   userId: SnowflakeIdSchema,
//   startedAt: z.date(),
// });
// export type SessionEntity = z.infer<typeof SessionEntitySchema>;

// type DeviceId = string;

// export const SessionContextSchema = z.object({
//   supabaseClient: SessionEntitySchema,
// });
// export type SessionContext = z.infer<typeof SessionContextSchema>;

// export const SessionEventSchema = z.object({
//   type: z.literal('HEARTBEAT'),
// });

export type ConnectionContext = {
  location?: string;
  deviceId?: SnowflakeId;
  authTokens?: AuthTokens;
  supabaseClient?: SupabaseClient<Database>;
};

export type InitializedConnectionContext = MakeRequired<
  ConnectionContext,
  'deviceId' | 'authTokens' | 'location' | 'supabaseClient'
>;

export type InitializedConnectionEntity = MakeRequired<
  ConnectionEntity,
  'sessionId' | 'userId'
> & {
  context: InitializedConnectionContext;
};

// CONNECTION ENTITY
export type ConnectionTypeState =
  | {
      value: 'Initialized';
      context: InitializedConnectionContext;
    }
  | {
      value: 'Unitialized';
      context: ConnectionContext;
    };

export const ConnectionInitializeInputSchema = z.object({
  deviceId: SnowflakeIdSchema.optional(),
  initialLocation: z.string(),
  authTokens: AuthTokensSchema.optional(),
});

const ConnectionStateValueSchema = z.object({
  Initialized: z.enum(['True', 'False']),
});

type ConnectionStateValue = z.infer<typeof ConnectionStateValueSchema>;

export interface ConnectionStateSchema extends StateSchema {
  states: {
    Initialized: {
      states: {
        [K in ConnectionStateValue['Initialized']]: {};
      };
    };
  };
}

const ConnectionInitializeCommandSchema =
  ConnectionInitializeInputSchema.extend({
    type: z.literal('INITIALIZE'),
  });

// export type SessionMachineSchema = MachineSchema<SessionContext, SessionEvent>;
export type ConnectionMachine = StateMachine<
  ConnectionContext,
  ConnectionStateSchema,
  ConnectionCommand
>;
export type ConnectionState = StateFrom<ConnectionMachine>;
export type ConnectionInterpreter = InterpreterFrom<ConnectionMachine>;

export type SessionContext = {
  foo?: string;
};

export type SessionTypeState = {
  value: 'Active';
  context: MakeRequired<SessionContext, 'foo'>;
};
export type SessionMachine = StateMachine<
  SessionContext,
  SessionStateSchema,
  SessionCommand
>;
const EntityChangeDeltaSchema = z.object({
  property: z.string(),
  value: z.any(),
  prevValue: z.any(),
});

// Define the EntityChangeEvent schema with a type parameter TEntitySchema
const EntityChangeEventSchema = z.object({
  type: z.literal('CHANGE'),
  delta: EntityChangeDeltaSchema,
});

const EntitySendTriggerEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.object({
    type: z.literal('SEND_TRIGGER'),
    command: commandSchema,
  });

const EntitySendErrorEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.object({
    type: z.literal('SEND_ERROR'),
    command: commandSchema,
  });

const EntitySendCompleteEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.object({
    type: z.literal('SEND_COMPLETE'),
    command: commandSchema,
  });

const EntityTransitionStateEventSchema = z.object({
  type: z.literal('TRANSITION'),
});

const EntityEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.union([
    EntitySendCompleteEventSchema(commandSchema),
    EntitySendErrorEventSchema(commandSchema),
    EntitySendTriggerEventSchema(commandSchema),
    EntityChangeEventSchema,
    EntityTransitionStateEventSchema,
  ]);

// ------------ User Entity Definition ------------
const UserContextSchema = z.object({
  foo: z.string(),
});

export const UserInitializePropsSchema = z.object({
  connectionId: SnowflakeIdSchema,
  userId: SnowflakeIdSchema,
});

const UserEntityPropsSchema = z.object({
  schema: UserSchemaTypeLiteral,
  userId: SnowflakeIdSchema.optional(),
  name: PlayerNameSchema.optional(),
  discriminator: z.number().default(0),
  sessionId: SnowflakeIdSchema,
  connections: z.array(
    z.object({
      id: SnowflakeIdSchema,
      createdAt: z.date(),
      connected: z.boolean(),
    })
  ),
});

export type UserContext = {
  foo: string;
};

export interface UserStateSchema extends StateSchema<UserContext> {
  states: {
    Online: {
      states: {
        [K in UserStateValue['Online']]: {};
      };
    };
  };
}

const UserCommandSchema = z.object({
  type: z.literal('ADD_CONNECTION'),
  connectionId: SnowflakeIdSchema,
});
export type UserCommand = z.infer<typeof UserCommandSchema>;

export type UserMachine = StateMachine<
  UserContext,
  UserStateSchema,
  UserCommand
>;
export type UserInterpreter = InterpreterFrom<UserMachine>;

const UserStateValueSchema = z.object({
  Online: z.enum(['True', 'False']),
});

type UserStateValue = z.infer<typeof UserStateValueSchema>;

export const UserEntitySchema = EntityBaseSchema(
  UserEntityPropsSchema,
  UserCommandSchema,
  UserContextSchema,
  UserStateValueSchema
);
export type UserEntity = z.infer<typeof UserEntitySchema>;

// ------------ Room Entity ------------
const RoomContextSchema = z.object({
  foo: z.string(),
});
export type RoomContext = z.infer<typeof RoomContextSchema>;

const RoomEntityPropsSchema = z.object({
  schema: RoomSchemaTypeLiteral,
  ownerHostId: SnowflakeIdSchema,
  url: z.string().url(),
});

const RoomCommandSchema = z.union([
  z.object({
    type: z.literal('JOIN'),
  }),
  z.object({
    type: z.literal('LEAVE'),
  }),
]);

type RoomCommand = z.infer<typeof RoomCommandSchema>;

const RoomStateValueSchema = z.object({
  Empty: z.enum(['True', 'False']),
});

export interface RoomStateSchema extends StateSchema<UserContext> {
  states: {
    Empty: {
      states: {
        [K in RoomStateValue['Empty']]: {};
      };
    };
  };
}

type RoomStateValue = z.infer<typeof RoomStateValueSchema>;

export const RoomEntitySchema = EntityBaseSchema(
  RoomEntityPropsSchema,
  RoomCommandSchema,
  RoomContextSchema,
  RoomStateValueSchema
);
export type RoomMachine = StateMachine<
  RoomContext,
  RoomStateSchema,
  RoomCommand
>;
export type RoomEntity = z.infer<typeof RoomEntitySchema>;

// ------------ Session Entity ------------
const SessionContextSchema = z.object({
  foo: z.string(),
});

const SessionEntityPropsSchema = z.object({
  schema: SessionSchemaTypeLiteral,
  userId: UserIdSchema,
});

const SessionCommandSchema = z.union([
  z.object({
    type: z.literal('RECONNECT'),
  }),
  z.object({
    type: z.literal('DISCONNECT'),
  }),
]);
export type SessionCommand = z.infer<typeof SessionCommandSchema>;

const SessionStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});
type SessionStateValue = z.infer<typeof SessionStateValueSchema>;

export const SessionEntitySchema = EntityBaseSchema(
  SessionEntityPropsSchema,
  SessionCommandSchema,
  SessionContextSchema,
  SessionStateValueSchema
);

export interface SessionStateSchema extends StateSchema<SessionContext> {
  states: {
    Active: {
      states: {
        [K in SessionStateValue['Active']]: {};
      };
    };
  };
}

export type SessionStateMachine = StateMachine<
  SessionContext,
  SessionStateSchema,
  SessionCommand
>;

export type SessionEntity = z.infer<typeof SessionEntitySchema>;

// ------------ Connection Entity ------------
const ConnectionContextSchema = z.object({
  authTokens: AuthTokensSchema.optional(),
  deviceId: SnowflakeIdSchema.optional(),
});

const ConnectionEntityPropsSchema = z.object({
  schema: ConnectionSchemaTypeLiteral,
  sessionId: SnowflakeIdSchema.optional(),
  userId: SnowflakeIdSchema.optional(),
  instanceId: z.string().uuid(),
});
export type ConnectionEntityProps = z.infer<typeof ConnectionEntityPropsSchema>;

const ConnectionHeartbeatCommandSchema = z.object({
  type: z.literal('HEARTBEAT'),
});

const ConnectionNavigateCommandSchema = z.object({
  type: z.literal('NAVIGATE'),
  location: z.string().url(),
});

const ConnectionCommandSchema = z.union([
  ConnectionInitializeCommandSchema,
  ConnectionHeartbeatCommandSchema,
  ConnectionNavigateCommandSchema,
]);
export type ConnectionCommand = z.infer<typeof ConnectionCommandSchema>;

export type ConnectionStateMachine = StateMachine<
  ConnectionContext,
  ConnectionStateSchema,
  ConnectionCommand
>;

export const ConnectionEntitySchema = EntityBaseSchema(
  ConnectionEntityPropsSchema,
  ConnectionCommandSchema,
  ConnectionContextSchema,
  ConnectionStateValueSchema
);
export type ConnectionEntity = z.infer<typeof ConnectionEntitySchema>;

export const EntitySchema = z.union([
  RoomEntitySchema,
  UserEntitySchema,
  SessionEntitySchema,
  ConnectionEntitySchema,
]);
export type Entity = z.infer<typeof EntitySchema>;

export const EntitySchemas = {
  user: UserEntitySchema,
  room: RoomEntitySchema,
  session: SessionEntitySchema,
  connection: ConnectionEntitySchema,
};

export function isEntity(entity: unknown): entity is Entity {
  return EntitySchema.safeParse(entity).success;
}

export const AllCommandsSchema = z.union([
  RoomCommandSchema,
  UserCommandSchema,
]);

type EntityChangeDelta<TEntity extends Entity> = {
  property: keyof TEntity;
  value: TEntity[keyof TEntity];
  prevValue: TEntity[keyof TEntity];
};

// const EntityChangeEventSchema = z.object({
//   type: z.literal('CHANGE'),
//   data: EntitySchema,
//   delta: z.object({
//     property: z.string(),
//     value: z.any(),
//     prevValue: z.any(),
//   }),
// });

// export interface EntityChangeEvent<TEntity extends Entity> {
//   type: 'CHANGE';
//   data: TEntity;
//   delta: EntityChangeDelta<TEntity>;
// }

// export type EntitiesInitEvent<TEntity extends Entity> = {
//   type: 'INIT';
//   data: TEntity[];
// };

// export type EntityAddEvent<TEntity extends Entity> = {
//   type: 'ADD';
//   data: TEntity;
// };

// export type EntityRemoveEvent<TEntity extends Entity> = {
//   type: 'REMOVE';
//   data: TEntity;
// };

// export type EntityListEvent<TEntity extends Entity> =
//   | EntitiesInitEvent<TEntity>
//   | EntityAddEvent<TEntity>
//   | EntityRemoveEvent<TEntity>;

// export type EntityEvent<TEntity extends Entity> =
//   | EntitiesInitEvent<TEntity>
//   | EntityChangeEvent<TEntity>
//   | EntityAddEvent<TEntity>
//   | EntityRemoveEvent<TEntity>;

// export function isEntityChangeEvent<TEntity extends Entity>(
//   event: EntityEvent<TEntity>
// ): event is EntityChangeEvent<TEntity> {
//   return event.type === 'CHANGE';
// }

// export function isEntitiesInitEvent<TEntity extends Entity>(
//   event: EntityEvent<TEntity>
// ): event is EntitiesInitEvent<TEntity> {
//   return event.type === 'INIT';
// }

// export function isEntityAddEvent<TEntity extends Entity>(
//   event: EntityEvent<TEntity>
// ): event is EntityAddEvent<TEntity> {
//   return event.type === 'ADD';
// }

// export function isEntityRemoveEvent<TEntity extends Entity>(
//   event: EntityEvent<TEntity>
// ): event is EntityRemoveEvent<TEntity> {
//   return event.type === 'REMOVE';
// }

// export function isEntityListEvent<TEntity extends Entity>(
//   event: EntityEvent<TEntity>
// ): event is EntityListEvent<TEntity> {
//   return (
//     event.type === 'INIT' || event.type === 'ADD' || event.type === 'REMOVE'
//   );
// }

export type EntityMachine =
  | {
      type: 'connection';
      machine: ConnectionMachine;
    }
  | {
      type: 'user';
      machine: UserMachine;
    }
  | {
      type: 'room';
      machine: RoomMachine;
    }
  | {
      type: 'session';
      machine: SessionMachine;
    };

export type EntityMachineMap = IndexByType<EntityMachine>;
