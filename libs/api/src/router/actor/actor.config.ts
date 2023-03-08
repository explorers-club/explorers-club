import { AnyStateMachine, createMachine } from 'xstate';
import { ActorType } from '../../ecs/schema';

export const actorMachines: Record<ActorType, AnyStateMachine> = {
  staging_room: createMachine({
    id: 'StagingRoom',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  }),
  little_vigilante_room: createMachine({
    id: 'LittleVigilanteRoom',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  }),
  // lobby_room: createMachine({
  //   id: 'LobbyRoom',
  //   initial: 'Idle',
  //   states: {
  //     Idle: {},
  //   },
  // }),
  // codebreakers_room: createMachine({
  //   id: 'CodebreakersRoom',
  //   initial: 'Idle',
  //   states: {
  //     Idle: {},
  //   },
  // }),
};
