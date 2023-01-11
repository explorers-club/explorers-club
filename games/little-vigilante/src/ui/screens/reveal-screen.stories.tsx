import { ComponentStory } from '@storybook/react';
import { RevealScreenComponent } from './reveal-screen.component';

export default {
  component: RevealScreenComponent,
};

export const Default: ComponentStory<typeof RevealScreenComponent> = (args) => {
  return <RevealScreenComponent {...args} />;
};

Default.args = {
  playerRoles: [
    ['Player 1', 'Vigilante'],
    ['Player 2', 'Butler'],
    ['Player 3', 'Cop'],
    ['Player 4', 'Mayor'],
  ],
};
