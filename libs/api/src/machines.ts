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

export type EntityMachineCreators = {
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

export const createEntityMachine = (
  schema: SchemaType,
  props: { world: World<Entity>; entity: Entity }
) => {
  if (schema === 'connection') {
    return createConnectionMachine(props) as ConnectionMachine;
  } else if (schema === 'session') {
    return createSessionMachine(props) as SessionMachine;
  } else if (schema === 'room') {
    return createRoomMachine(props) as RoomMachine;
  } else if (schema === 'user') {
    return createUserMachine(props) as UserMachine;
  } else {
    throw new Error('Unimplemented schema type ' + schema);
  }
};
