import { Entity, SchemaType } from '@explorers-club/schema';
import { World } from 'miniplex';
import { AnyStateMachine, createMachine } from 'xstate';
import { createConnectionMachine } from './connection';

type CreateMachineMap = Record<
  Entity['schema'],
  <TProps extends { world: World<Entity>; schema: SchemaType }>(
    props: TProps
  ) => AnyStateMachine
>;

const createPlayerMachine = () => {
  return createMachine({
    id: 'PlayerMachine',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  });
};

const createRoomMachine = () => {
  return createMachine({
    id: 'RoomMachine',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  });
};

export const machineMap: CreateMachineMap = {
  connection: createConnectionMachine,
  staging_room: createRoomMachine,
  little_vigilante_room: createRoomMachine,
  player: createPlayerMachine,
};
