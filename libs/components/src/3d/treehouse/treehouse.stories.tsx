import { Meta } from '@storybook/react';
import { Treehouse } from './treehouse.component';
import { CanvasSetup } from '../__stories/CanvasSetup';

export default {
  component: Treehouse,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Primary = {
  render: () => <Treehouse />,
  parameters: {
    layout: 'fullscreen',
  },
};
