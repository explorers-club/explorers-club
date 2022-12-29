// import { Args } from '@storybook/api';
import { Meta } from '@storybook/react';
import { resDistanceMap } from './tile-viewer.constants';
import { TileViewer } from './tile-viewer.component';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { SunsetSky } from '../sky/sky.component';
import { useFrame, useThree } from '@react-three/fiber';
import { useState } from 'react';
import { useControls } from 'leva';
import { createTileViewerMachine } from './tile-viewer.machine';
import { useInterpret } from '@xstate/react';

export default {
  component: TileViewer,
  decorators: [
    // todo: withSunsetSky decorator
    (Story) => (
      <>
        <Story />
        <SunsetSky />
      </>
    ),
    withCanvasSetup,
  ],
} as Meta;

const ComponentStory = () => {
  const camera = useThree((state) => state.camera);
  const { res } = useControls('TileViewer', {
    res: {
      value: 3,
      min: 0,
      max: 15,
      step: 1,
    },
  });

  useFrame((state) => {
    const camera = state.camera;
    const distance = getCameraDistanceForRes(res);
    camera.position.setY(distance);
  });

  const [machine] = useState(createTileViewerMachine(camera));
  const actor = useInterpret(machine);

  return <TileViewer actor={actor} />;
};
const getCameraDistanceForRes = (res: number) => {
  return resDistanceMap[res];
};

export const Default = {
  render: () => <ComponentStory />,
};
