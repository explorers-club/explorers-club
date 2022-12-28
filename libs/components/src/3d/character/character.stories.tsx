import { Meta } from '@storybook/react';
import { Character } from './character.component';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { Grid } from '@react-three/drei';

export default {
  component: Character,
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
  return <Character />;
};
