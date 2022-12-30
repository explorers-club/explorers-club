import { Meta } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { Floor } from './floor.component';

export default {
  component: Floor,
  decorators: [withCanvasSetup],
} as Meta;

export const Primary = {
  render: () => <Floor />,
  parameters: {
    layout: 'fullscreen',
  },
};
