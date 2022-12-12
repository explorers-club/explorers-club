import { Meta } from '@storybook/react';
import { Floor } from './floor.component';
import { CanvasSetup } from '../__stories/CanvasSetup';

export default {
  component: Floor,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Primary = {
  render: () => <Floor />,
  parameters: {
    layout: 'fullscreen',
  },
};
