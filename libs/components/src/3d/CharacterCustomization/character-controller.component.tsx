import { useGLTF, useAnimations } from '@react-three/drei';
import { useInterpret } from '@xstate/react';
import { useRef, useMemo, useEffect } from 'react';
import { useInput } from '../../hooks/useInput';
import { Character } from './character.component';
import { createCharacterMachine } from './character.machine';
import { GLTFResult, CharacterAnimationAction } from './character.types';

export const CharacterController = () => {
  const gltf = useGLTF('./assets/woman.gltf') as unknown as GLTFResult;
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, group) as unknown as {
    actions: CharacterAnimationAction;
  };
  const machine = useMemo(() => createCharacterMachine(actions), [actions]);
  const actor = useInterpret(machine);

  const { forward, shift } = useInput();

  useEffect(() => {
    if (shift) {
      actor.send('DANCE');
    } else if (forward) {
      actor.send({ type: 'MOVE', lat: 10, lng: 10 });
    } else {
      actor.send('IDLE');
    }
  });

  return <Character gltf={gltf} group={group} />;
};
