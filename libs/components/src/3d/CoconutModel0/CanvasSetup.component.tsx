import { CharacterCustomizationProvider } from './Customization-context.component';

import { Stats } from '@react-three/drei';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { Leva, useControls } from 'leva';
import * as React from 'react';
import { Fragment } from 'react';
import { Vector3 } from 'three';
import { Args, DecoratorFunction } from '@storybook/csf';
import { ReactFramework } from '@storybook/react';
import { CameraControls } from '@3d/CharacterCustomization/Cameracontrols.component';

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
    <Fragment>
      <Leva collapsed />
      <Canvas
        style={{ height: '100vh' }}
        shadows
        camera={{ position: cameraPosition, fov: cameraFov, far: 20000 }}
        {...restProps}
      >
        <Fragment>
          {showStats && <Stats />}
          {showGrid && <gridHelper />}
          {/* <cameraHelper /> */}
          {children}
          {lights && (
            <>
              <ambientLight intensity={0.8} />
              <pointLight intensity={0.5} position={[20, 20, 20]} />
              <pointLight intensity={0.5} position={[-20, -20, -20]} />
            </>
          )}
        </Fragment>
      </Canvas>
    </Fragment>
  );
};

export const withCanvasSetup: DecoratorFunction<ReactFramework, Args> = (
  Story
) => {
  return (
    <CharacterCustomizationProvider>
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    </CharacterCustomizationProvider>
  );
};
