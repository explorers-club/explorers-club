import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ComponentStory, Meta } from '@storybook/react';
import { Euler, Vector3 } from 'three';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { PointAndClickScene } from './point-and-click-scene.component';

export default {
  component: PointAndClickScene,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Primary: ComponentStory<typeof PointAndClickScene> = (args) => {
  const cameraPosition = new Vector3(
    -10.628343160964867,
    1.4250744973350962,
    -0.7021807057774349
  );
  const rotation = new Euler(
    0.6535102767134181,
    -0.5903589064753597,
    -0.47370948879579067
  );
  return (
    <Canvas
      style={{ height: '100vh' }}
      shadows
      camera={{
        position: cameraPosition,
        rotation: rotation,
      }}
    >
      <PointAndClickScene {...args} />;
      {/* <gridHelper /> */}
      <axesHelper />
      <OrbitControls />
    </Canvas>
  );
};

Primary.args = {
  imageUrl:
    'https://cdn.discordapp.com/attachments/1039255735390978120/1082021840878321774/InspectorT_line_art_deck_of_an_outdoorsy_social_club_in_2023_ov_ed9d3f35-fc97-4202-ad03-214ca6ecd9db.png',
};

// export const Primary = {
//   render: (args) => <PointAndClickScene {..args} />,
//   parameters: {
//     layout: 'fullscreen',
//   },
// };
