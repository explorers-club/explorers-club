import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { useRef, useEffect } from 'react';
import { useInput } from '../../hooks/useInput';
import { Character } from './character.component';
import { createCharacterMachine } from './character.machine';
import { GLTFResult, CharacterAnimationAction } from './character.types';

const SPEED_PER_SECOND = 2;

export const CharacterController = () => {
  const gltf = useGLTF('./assets/character.glb') as unknown as GLTFResult;
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, group) as unknown as {
    actions: CharacterAnimationAction;
  };
  const [state, send] = useMachine(() => createCharacterMachine(actions));

  const input = useInput();

  useEffect(() => {
    if (input.attack) {
      send('SHOOT');
    } else if (input.move) {
      send({
        type: 'MOVE',
        velocity: input.direction.clone().multiplyScalar(SPEED_PER_SECOND),
      });
    } else {
      send('IDLE');
    }
  }, [input, send]);

  useFrame((_threeState, delta) => {
    send({ type: 'FRAME', timeDeltaS: delta });
  });

  return (
    <Character
      gltf={gltf}
      group={group}
      position={state.context.position}
      rotation={state.context.rotation}
    />
  );
};
