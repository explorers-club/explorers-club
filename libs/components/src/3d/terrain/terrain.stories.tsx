import { Meta } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { Terrain } from './terrain.component';
import { readFileSync } from 'fs';

export default {
  component: Terrain,
  decorators: [withCanvasSetup],
} as Meta;

const StoryComponent = () => {
  return <Terrain />;
};

export const Default = {
  render: () => <StoryComponent />,
};
