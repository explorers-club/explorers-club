import { useGLTF, useAnimations } from '@react-three/drei';
import { useMachine } from '@xstate/react';
import { useRef, useEffect } from 'react';
import { useInput } from '../../hooks/useInput';
import { Character } from './character.component';
import { createCharacterMachine } from './character.machine';
import { GLTFResult, CharacterAnimationAction } from './character.types';

export const CharacterController = () => {
  const gltf = useGLTF('./assets/character.glb') as unknown as GLTFResult;
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, group) as unknown as {
    actions: CharacterAnimationAction;
  };
  const [state, send] = useMachine(() => createCharacterMachine(actions));

  const { forward, shift } = useInput();

  useEffect(() => {
    if (shift) {
      send('SHOOT');
    } else if (forward) {
      send({ type: 'MOVE', dx: 0.5, dz: 0.5 });
    } else {
      send('IDLE');
    }
  });

  return (
    <Character gltf={gltf} group={group} position={state.context.position} />
  );
};
