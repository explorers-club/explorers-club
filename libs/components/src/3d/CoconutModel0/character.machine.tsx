import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { CharacterAnimationAction } from './character.types';

type CharacterContext = {
  healthPoints: number;
  ammo: number;
};

type CharacterEvent =
  | { type: 'MOVE'; lat: number; lng: number }
  | { type: 'DANCE' }
  | { type: 'IDLE' }
  | { type: 'GUITARPLAYING' }
  | { type: 'TAKE_DAMAGE' };

export const createCharacterMachine = (actions: CharacterAnimationAction) =>
  createMachine({
    id: 'CharacterMachine',
    schema: {
      context: {} as CharacterContext,
      events: {} as CharacterEvent,
    },
    context: {
      healthPoints: 100,
      ammo: 10,
    },
    type: 'parallel',
    states: {
      MainActivity: {
        initial: 'Idle',
        states: {
          Idle: {
            entry: () => {
              actions.Walking.stop();
            },
            on: {
              MOVE: 'Running',
            },
          },
          Running: {
            entry: () => {
              actions.Walking.play();
            },
            on: {
              IDLE: 'Idle',
            },
          },
        },
      },
      Alive: {
        initial: 'Yes',
        states: {
          Yes: {
            on: {
              TAKE_DAMAGE: 'No',
            },
          },
          No: {},
        },
      },
    },
  });

type CharacterMachine = ReturnType<typeof createCharacterMachine>;
export type CharacterActor = ActorRefFrom<CharacterMachine>;
export type CharacterState = StateFrom<CharacterMachine>;
