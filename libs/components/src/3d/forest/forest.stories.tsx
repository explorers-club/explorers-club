import { Meta } from '@storybook/react';
import { Vector3 } from 'three';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { Forest } from './forest.component';

export default {
  component: Forest,
  decorators: [
    (Story) => (
      <CanvasSetup cameraPosition={new Vector3(-15, 10, 40)}>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Default = () => {
  return <Forest />;
};
