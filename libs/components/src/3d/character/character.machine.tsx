import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { CharacterAnimationAction } from './character.types';

type CharacterContext = {
  healthPoints: number;
  ammo: number;
};

type CharacterEvent =
  | { type: 'MOVE'; lat: number; lng: number }
  | { type: 'SHOOT' }
  | { type: 'IDLE' }
  | { type: 'TAKE_DAMAGE'; amount: number };

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
              actions.RunForward.stop();
              actions.DrawArrow.stop();
              actions.StandingIdle.play();
            },
            on: {
              SHOOT: 'Shooting',
              MOVE: 'Running',
            },
          },
          Running: {
            entry: () => {
              actions.RunForward.play();
            },
            on: {
              IDLE: 'Idle',
            },
          },
          Shooting: {
            entry: () => {
              actions.DrawArrow.play();
            },
            after: {
              1100: 'Idle',
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
