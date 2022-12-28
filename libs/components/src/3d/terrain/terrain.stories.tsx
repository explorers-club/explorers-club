import { Meta } from '@storybook/react';
import { Terrain } from './terrain.component';
import { CanvasSetup } from '../__stories/CanvasSetup';

export default {
  component: Terrain,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Default = {
  render: () => <Terrain />,
  parameters: {
    layout: 'fullscreen',
  },
};
