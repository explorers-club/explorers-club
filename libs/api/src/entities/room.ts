import { Entity } from '@explorers-club/schema';
import { createMachine } from 'xstate';
import { World } from 'miniplex';

export const createRoomMachine = ({
  world,
}: {
  world: World;
  entity: Entity;
}) => {
  return createMachine({
    id: 'RoomMachine',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  });
};
