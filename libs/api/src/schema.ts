// import { StateValue } from 'xstate';
// import { z } from 'zod';

// export const SnowflakeIdSchema = z.string();
// export type SnowflakeId = z.infer<typeof SnowflakeIdSchema>;

// export const UserIdSchema = SnowflakeIdSchema;
// export const ECEpochTimestampSchema = z.number();
// export type ECEpochTimestamp = z.infer<typeof ECEpochTimestampSchema>;

// const UserSchema = z.object({
//   id: UserIdSchema,
// });

// export const ClubNameSchema = z.string();

// type UserEntity = z.infer<typeof UserSchema>;

// export const GameIdSchema = z.enum(['little_vigilante', 'codebreakers']);

// export const GameInstanceIdSchema = z.string();

// const ClientIdSchema = SnowflakeIdSchema;

// export const ClientSchema = z.object({
//   id: ClientIdSchema,
// });

// const RoomIdSchema = ClubNameSchema;

// const RoomSchema = z.object({
//   id: RoomIdSchema,
//   gameId: GameIdSchema.optional(),
//   gameInstanceId: GameInstanceIdSchema.optional(),
//   clients: z.array(ClientSchema),
// });
// export type RoomEntity = z.infer<typeof RoomSchema>;

// type GameInstanceEntity = z.infer<typeof RoomSchema>;

// const PlayerTypeLiteral = z.literal('player');
// const StagingRoomTypeLiteral = z.literal('staging_room');
// const LittleVigilanteRoomTypeLiteral = z.literal('little_vigilante_room');

// export const ActorTypeSchema = z.union([
//   StagingRoomTypeLiteral,
//   LittleVigilanteRoomTypeLiteral,
//   PlayerTypeLiteral,
// ]);
// export type ActorType = z.infer<typeof ActorTypeSchema>;

// const ActorIdSchema = SnowflakeIdSchema;

// const StateValueSchema: z.ZodType<StateValue> = z.union([
//   z.string(),
//   z.record(z.lazy(() => StateValueSchema)),
// ]);

// export const EntitySchemaSchema = z.enum(['actor', 'room']);
// export type EntitySchema = z.infer<typeof EntitySchemaSchema>;

// export const EntityPolicySchema = z.string();
// export type EntityPolicy = z.infer<typeof EntityPolicySchema>;

// const EntityBaseSchema = z.object({
//   id: SnowflakeIdSchema,
//   schema: EntitySchemaSchema,
//   children: z.array(SnowflakeIdSchema),
// });

// const SharedEntitySchema = EntityBaseSchema.extend({
//   flushedAt: ECEpochTimestampSchema,
//   policy: EntityPolicySchema,
// });

// const ActorBaseSchema = SharedEntitySchema.extend({
//   states: StateValueSchema.optional(),
// });

// const NameSchema = z.string();

// const RoomNameSchema = NameSchema;

// const StagingRoomContextSchema = z.object({
//   name: RoomNameSchema,
// });

// const StagingRoomOptionsSchema = z.object({
//   actorType: StagingRoomTypeLiteral,
//   name: RoomNameSchema,
// });

// const StagingRoomSchema = ActorBaseSchema.extend({
//   actorType: StagingRoomTypeLiteral,
//   context: StagingRoomContextSchema,
// });

// const PlayerContextSchema = z.object({
//   name: NameSchema,
// });

// const PlayerOptionsSchema = z.object({
//   actorType: PlayerTypeLiteral,
//   name: NameSchema,
// });

// const PlayerSchema = ActorBaseSchema.extend({
//   actorType: PlayerTypeLiteral,
//   context: PlayerContextSchema,
// });

// const LittleVigilanteRoomContextSchema = z.object({
//   name: RoomNameSchema,
// });

// const LittleVigilanteRoomSchema = ActorBaseSchema.extend({
//   actorType: LittleVigilanteRoomTypeLiteral,
//   context: LittleVigilanteRoomContextSchema,
// });

// const LittleVigilanteRoomOptionsSchema = z.object({
//   actorType: LittleVigilanteRoomTypeLiteral,
//   name: RoomNameSchema,
// });

// export const ActorSchema = z.union([
//   StagingRoomSchema,
//   LittleVigilanteRoomSchema,
//   PlayerSchema,
// ]);

// export const ActorOptionsSchema = z.union([
//   StagingRoomOptionsSchema,
//   PlayerOptionsSchema,
//   LittleVigilanteRoomOptionsSchema,
// ]);

// export type ActorId = z.infer<typeof ActorIdSchema>;
// export type ActorEntity = z.infer<typeof ActorSchema>;

// export type Entity = RoomEntity | UserEntity | GameInstanceEntity | ActorEntity;
