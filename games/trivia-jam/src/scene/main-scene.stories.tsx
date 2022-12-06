import { CanvasSetup } from '../../.storybook/CanvasSetup';
import { MainScene } from './main-scene';
import { Meta } from '@storybook/react';

const meta = {
  component: MainScene,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Default = () => {
  return <MainScene />;
};

Default.parameters = {
  layout: 'fullscreen',
};

export default meta;
