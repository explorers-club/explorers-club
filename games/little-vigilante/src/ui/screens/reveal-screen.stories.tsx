import { ComponentStory } from '@storybook/react';
import { RevealScreenComponent } from './reveal-screen.component';

export default {
  component: RevealScreenComponent,
};

export const Default: ComponentStory<typeof RevealScreenComponent> = (args) => {
  return <RevealScreenComponent {...args} />;
};

Default.args = {
  playerOutcomes: [
    { playerName: 'Player 1', role: 'vigilante', winner: true },
    { playerName: 'Player 2', role: 'butler', winner: true },
    { playerName: 'Player 3', role: 'cop', winner: false },
    { playerName: 'Player 4', role: 'mayor', winner: false },
  ],
};
