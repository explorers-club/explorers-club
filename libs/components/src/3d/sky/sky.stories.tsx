import { Meta } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { SunsetSky } from './sky.component';

export default {
  component: SunsetSky,
  decorators: [withCanvasSetup],
} as Meta;

export const Primary = {
  render: () => <SunsetSky />,
  parameters: {
    layout: 'fullscreen',
  },
};
