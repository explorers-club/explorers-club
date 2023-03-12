import { Meta, Story } from '@storybook/react';

import { Character } from './character.component';
import { CharacterController } from './character-controller.component';
import { CharacterCustomizationProvider } from './Customization-context.component';

export const CharacterComponent = () => {
  return (
    <CharacterCustomizationProvider>
      <CharacterController />
    </CharacterCustomizationProvider>
  );
};
