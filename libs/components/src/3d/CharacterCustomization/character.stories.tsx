import { Meta, Story } from '@storybook/react';
import { withCanvasSetup } from './CanvasSetupForCustomization';
import { Character } from './character.component';
import { CharacterController } from './character-controller.component';
import { CharacterCustomizationProvider } from './character-customization.context';
import { Interface } from './Customization.interface';
import { CameraControls } from './Customization.cameracontrols';

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
