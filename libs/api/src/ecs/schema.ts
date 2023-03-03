import { ArchetypeBucket, World } from 'miniplex';
import { z } from 'zod';
// import type { StateValue } from 'xstate';
import { O } from '@mobily/ts-belt';
import { StateValue } from 'xstate';

export const SnowflakeIdSchema = z.string();
export type SnowflakeId = z.infer<typeof SnowflakeIdSchema>;

export const UserIdSchema = SnowflakeIdSchema;
export const ECEpochTimestampSchema = z.number();
export type ECEpochTimestamp = z.infer<typeof ECEpochTimestampSchema>;

const UserSchema = z.object({
  id: UserIdSchema,
});

export const ClubNameSchema = z.string();

type UserEntity = z.infer<typeof UserSchema>;

export const GameIdSchema = z.enum(['little_vigilante', 'codebreakers']);

export const GameInstanceIdSchema = z.string();

const ClientIdSchema = SnowflakeIdSchema;

export const ClientSchema = z.object({
  id: ClientIdSchema,
});

const RoomIdSchema = ClubNameSchema;

const RoomSchema = z.object({
  id: RoomIdSchema,
  gameId: GameIdSchema.optional(),
  gameInstanceId: GameInstanceIdSchema.optional(),
  clients: z.array(ClientSchema),
});
export type RoomEntity = z.infer<typeof RoomSchema>;

type GameInstanceEntity = z.infer<typeof RoomSchema>;

// TODO if we want to type this all we can create separate actors and union them
// like we do with Entity.
export const ActorTypeSchema = z.enum([
  'little_vigilante_server',
  'codebreakers_server',
]);
export type ActorType = z.infer<typeof ActorTypeSchema>;

const ActorIdSchema = SnowflakeIdSchema;
const ActorStatesSchema = z.array(z.string());
type ActorStates = z.infer<typeof ActorStatesSchema>;

// const StateValueSchema = z.union([z.string(), z.lazy(() => StateValueMapSchema.array())]);
// const StateValueMapSchema = z.record(StateValueSchema);

const BaseStateValueSchema = z.string();

// const StateValueMap

// const StateValueSchema = z.union([z.string(), z.record(z.string())])

const StateValueSchema: z.ZodType<StateValue> = z.union([
  z.string(),
  z.record(z.lazy(() => StateValueSchema)),
]);

// const StateValueSchema: z.ZodType

export const ActorSchema = z.object({
  id: ActorIdSchema,
  actorType: ActorTypeSchema,
  flushedAt: ECEpochTimestampSchema,
  context: z.unknown(),
  states: StateValueSchema.optional(),
});
export type ActorId = z.infer<typeof ActorIdSchema>;
export type ActorEntity = z.infer<typeof ActorSchema>;

export const EntitySchemaSchema = z.enum(['actor', 'room']);
export type EntitySchema = z.infer<typeof EntitySchemaSchema>;

export const EntityPolicySchema = z.string();
export type EntityPolicy = z.infer<typeof EntityPolicySchema>;

// const LittleVigilanteActorSchema = z.object({
//   id: ActorIdSchema,
//   type: z.literal("little_vigilante_server"),
//   states: ActorStatesSchema,
//   context: z.object({

//   })
// })

export type Entity = RoomEntity | UserEntity | GameInstanceEntity | ActorEntity;

// type FromZobObject<T extends ZodObject<any>> = T extends ZodObject<infer U>
//   ? U
//   : never;
