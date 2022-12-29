// From https://github.com/pmndrs/drei/blob/master/.storybook/Setup.tsx
// Also duplicated from trivia jam, pull in to common lib
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { useControls } from 'leva';
import * as React from 'react';
import { Vector3 } from 'three';

type Props = React.PropsWithChildren<
  CanvasProps & {
    cameraFov?: number;
    cameraPosition?: Vector3;
    controls?: boolean;
    lights?: boolean;
  }
>;

export const CanvasSetup = ({
  children,
  cameraFov = 75,
  cameraPosition = new Vector3(-5, 5, 5),
  controls = true,
  lights = true,
  ...restProps
}: Props) => {
  const { showGrid, showStats } = useControls('Global', {
    showStats: true,
    showGrid: true,
  });

  return (
    <Canvas
      style={{ height: '100vh' }}
      shadows
      camera={{ position: cameraPosition, fov: cameraFov }}
      {...restProps}
    >
      <>
        {showStats && <Stats />}
        {showGrid && <gridHelper />}
        {/* <cameraHelper /> */}
        {children}
        {lights && (
          <>
            <ambientLight intensity={0.8} />
            <pointLight intensity={1} position={[0, 6, 0]} />
          </>
        )}
        {controls && <OrbitControls />}
      </>
    </Canvas>
  );
};
