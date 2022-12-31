import { Vector3 } from 'three';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { CharacterAnimationAction } from './character.types';

type CharacterContext = {
  healthPoints: number;
  ammo: number;
  position: THREE.Vector3;
};

type CharacterEventMove = { type: 'MOVE'; dx: number; dz: number };
type CharacterEvent =
  | CharacterEventMove
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
      position: new Vector3(0, 0, 0),
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
              MOVE: {
                target: 'Running',
                actions: [
                  assign<CharacterContext, CharacterEventMove>({
                    position: (context, event) =>
                      new Vector3(
                        context.position.x + event.dx,
                        context.position.y,
                        context.position.z + event.dz
                      ),
                  }),
                ],
              },
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
