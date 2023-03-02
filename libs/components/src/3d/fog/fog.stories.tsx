import { Meta } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { FogMesh } from './fog.component';
import { RepeatWrapping } from 'three';
import { useTexture } from '@react-three/drei';

const Scene = () => {
  const fogTexture = useTexture('./assets/231.jpg');
  const displacementMap = useTexture('./assets/heightmap.png');
  displacementMap.wrapS = RepeatWrapping;
  displacementMap.wrapT = RepeatWrapping;
  const repeat = 30;
  displacementMap.repeat.set(1 / repeat, 1 / repeat);
  const mask = useTexture('./assets/blur.jpg');
  const displacementScale = 20;
  const displacementBias = -7.75;
  const r = 200;
  const terrainArgs = [r, r, r, r];
  const fogArgs = [r, r, r/100, r/100];
  return (
    <>
      <FogMesh 
        map={fogTexture} 
        displacementMap={displacementMap} 
        displacementScale={displacementScale} 
        displacementBias={displacementBias}
        mask={mask} 
        repeat={repeat}
        args={terrainArgs}
        strength={2.0}
        layers={4}
        thickness={2.0}
        position={[0, 3, 0.0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Terrain 
        displacementMap={displacementMap} 
        displacementScale={displacementScale} 
        displacementBias={displacementBias} 
        args={terrainArgs}
      />
      <Trees />
    </>
  );
};

export default {
  component: Scene,
  decorators: [withCanvasSetup],
} as Meta;

export const Primary = {
  render: () => <Scene />,
  parameters: {
    layout: 'fullscreen',
  },
};

const Terrain = ({args, ...props}) => {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={args} />
      <meshStandardMaterial
        color="#1BB364"
        {...props}
      />
    </mesh>
  );
};

function Trees({height=1.0}) {
  const h = height;
  return (
    <>
      <mesh position={[-3, h / 2 + 0.5, 0]}>
        <coneBufferGeometry args={[0.75, h * 2, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[4, h / 3 + 1, 1]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[4, h / 3 + 1, 2.5]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[1, h / 3 + 1, 3]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[1, h / 3 + 1, -3]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
    </>
  );
}
