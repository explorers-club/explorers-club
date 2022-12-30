import { Meta, Story } from '@storybook/react';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { Character } from './character.component';
import { CharacterController } from './character-controller.component';

export default {
  component: Character,
  decorators: [withCanvasSetup],
} as Meta;

export const ControlledCharacter: Story = () => {
  return <CharacterController />;
};
