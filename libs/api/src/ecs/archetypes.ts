import { ArchetypeBucket } from 'miniplex';
import {
  ActorSchema,
  ActorType,
  ECEpochTimestamp,
  EntityPolicy,
  EntitySchema,
  RoomEntity,
  SnowflakeId,
} from './schema';
import { world } from './world';
import { z } from 'zod';
import { StateValue } from 'xstate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FromArchetype<T extends ArchetypeBucket<any>> =
  T extends ArchetypeBucket<infer U> ? U : never;

export const archetypes = {
  shared: world.with<{
    id: SnowflakeId;
    flushedAt: ECEpochTimestamp;
    schema: EntitySchema;
    policy: EntityPolicy;
  }>('id', 'flushedAt', 'schema', 'policy'),
  actor: world.with<{
    id: SnowflakeId;
    flushedAt: ECEpochTimestamp;
    actorType: ActorType;
    context: unknown;
    states: StateValue;
  }>('id', 'flushedAt', 'actorType', 'context', 'states'),
};

export type SharedArchetype = FromArchetype<typeof archetypes.shared>;
export type ActorArchetype = FromArchetype<typeof archetypes.actor>;

// export type RoomArchetype = FromArchetype<typeof archetypes.room>;
// export type GameRoomArchetype = FromArchetype<typeof archetypes.gameRoom>;
// export type ActiveGameRoomArchetype = FromArchetype<
//   typeof archetypes.activeGameRoom
// >;
// export type LittleVigilanteServerArchetype = FromArchetype<
//   typeof archetypes.littleVigilanteServer
// >;

//   room: world.with<Pick<RoomEntity, 'id' | 'clients'>>('id', 'clients'),
//   gameRoom: world.with<Pick<RoomEntity, 'id' | 'clients' | 'gameId'>>(
//     'id',
//     'clients',
//     'gameId'
//   ),
//   activeGameRoom: world.with<
//     Pick<RoomEntity, 'id' | 'clients' | 'gameId' | 'gameInstanceId'>
//   >('id', 'clients', 'gameId', 'gameInstanceId'),
//   gameInstance: world.with('id', 'gameId', 'userIds', 'gameInstanceId'),
//   actor: world.with('id', 'states', 'context', 'event', 'type'),
//   littleVigilanteServer: world.with('id', 'config', 'littleVigilanteState'),
