import { Grid, useAnimations, useGLTF } from '@react-three/drei';
import { Meta, Story } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { Character } from './character.component';
import { CharacterActor, createCharacterMachine } from './character.machine';
import { CharacterAnimationAction, GLTFResult } from './character.types';

export default {
  component: Character,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

const Template: Story<{ run?: (actor: CharacterActor) => void }> = ({
  run,
}) => {
  const gltf = useGLTF('./assets/character.glb') as unknown as GLTFResult;
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, group) as unknown as {
    actions: CharacterAnimationAction;
  };
  const machine = useMemo(() => createCharacterMachine(actions), [actions]);
  const actor = useInterpret(machine);
  useEffect(() => {
    run && run(actor);
  }, [actor, run]);

  return <Character gltf={gltf} group={group} />;
};

export const Idle = Template.bind({});

export const Shooting = Template.bind({});

Shooting.args = {
  run: (actor) => {
    actor.send('SHOOT');
  },
};

export const Running = Template.bind({});

Running.args = {
  run: (actor) => {
    actor.send({ type: 'MOVE', lat: 10, lng: 10 });
  },
};
