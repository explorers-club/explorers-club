import { Grid } from '@react-three/drei';
import { Meta } from '@storybook/react';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { Tree } from './tree.component';

export default {
  component: Tree,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
        <Grid infiniteGrid={true} />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Default = () => {
  return <Tree />;
};
