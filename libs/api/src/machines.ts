import {
  ConnectionMachine,
  Entity,
  EntityMachine,
  RoomMachine,
  SchemaType,
  SessionMachine,
  UserMachine,
} from '@explorers-club/schema';
import { World } from 'miniplex';
import { createConnectionMachine } from './entities/connection';
import { createRoomMachine } from './entities/room';
import { createSessionMachine } from './entities/session';
import { createUserMachine } from './entities/user';

type EntityMachineCreators = {
  [TSchemaType in EntityMachine['type']]: (props: {
    world: World<Entity>;
    entity: Entity;
  }) => Extract<EntityMachine, { type: TSchemaType }>['machine'];
};

export const machineMap = {
  connection: createConnectionMachine,
  session: createSessionMachine,
  user: createUserMachine,
  room: createRoomMachine,
} as EntityMachineCreators;
