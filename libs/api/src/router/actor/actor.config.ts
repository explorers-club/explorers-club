import { AnyStateMachine, createMachine } from 'xstate';
import { ActorType } from '../../ecs/schema';

export const actorMachines: Record<ActorType, AnyStateMachine> = {
  codebreakers_server: createMachine({
    id: 'CodebreakersServerMachine',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  }),
  little_vigilante_server: createMachine({
    id: 'LittleVigilanteServerMachine',
    initial: 'Idle',
    states: {
      Idle: {},
    },
  }),
};
