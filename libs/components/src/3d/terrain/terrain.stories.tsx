import { Meta } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { Terrain } from './terrain.component';

export default {
  component: Terrain,
  decorators: [withCanvasSetup],
} as Meta;

export const Default = {
  render: () => <Terrain />,
  parameters: {
    layout: 'fullscreen',
  },
};
