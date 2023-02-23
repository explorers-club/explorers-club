import { Meta, Story } from '@storybook/react';
import { withCanvasSetup } from './CanvasSetup.component';
import { Character } from './character.component';
import { CharacterController } from './character-controller.component';
import { CharacterCustomizationProvider } from './Customization-context.component';
import { Interface } from './Customization-HUD.component';
import { CameraControls } from './Cameracontrols.component';

export default {
  component: Character,
  decorators: [withCanvasSetup],
} as Meta;

export const ControlledCharacter: Story = () => {
  return (
    <CharacterCustomizationProvider>
      <Interface />
      <CharacterController />
      <CameraControls />
    </CharacterCustomizationProvider>
  );
};
