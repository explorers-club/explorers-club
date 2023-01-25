import { ComponentMeta } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { Ocean } from './ocean.component';

export default {
  component: Ocean,
  decorators: [withCanvasSetup],
} as ComponentMeta<typeof Ocean>;

export const Default = () => {
  return <Ocean />;
};
