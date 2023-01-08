import { Euler, Quaternion, Vector3 } from 'three';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { CharacterAnimationAction } from './character.types';

type CharacterContext = {
  healthPoints: number;
  ammo: number;
  velocity: THREE.Vector3;
  position: THREE.Vector3;
  rotation: THREE.Euler;
};

type CharacterEventMove = { type: 'MOVE'; velocity: THREE.Vector3 };
type CharacterEventFrame = { type: 'FRAME'; timeDeltaS: number };
type CharacterEvent =
  | CharacterEventMove
  | CharacterEventFrame
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
      velocity: new Vector3(0, 0, 0),
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
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
                    velocity: (context, event) => event.velocity,
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
              FRAME: {
                actions: [
                  assign<CharacterContext, CharacterEventFrame>({
                    position: (context, event) =>
                      // Apply current velocity to current position
                      new Vector3(
                        context.position.x +
                          context.velocity.x * event.timeDeltaS,
                        context.position.y +
                          context.velocity.y * event.timeDeltaS,
                        context.position.z +
                          context.velocity.z * event.timeDeltaS
                      ),
                    rotation: (context, _event) => {
                      // Rotate to face current velocity
                      const quaternion = new Quaternion();
                      const vNormalized = context.velocity.clone().normalize();
                      quaternion.setFromUnitVectors(
                        new Vector3(0, 0, 1), // Character modeled facing +Z
                        vNormalized
                      );
                      return new Euler().setFromQuaternion(quaternion);
                    },
                  }),
                ],
              },
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
