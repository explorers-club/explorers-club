import { Meta } from '@storybook/react';
import { SunsetSky } from './sky.component';
import { CanvasSetup } from '../__stories/CanvasSetup';

export default {
  component: SunsetSky,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Primary = {
  render: () => <SunsetSky />,
  parameters: {
    layout: 'fullscreen',
  },
};
