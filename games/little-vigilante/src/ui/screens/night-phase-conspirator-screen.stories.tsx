import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseConspiratorScreenComponent } from './night-phase-conspirator-screen.component';

export default {
  component: NightPhaseConspiratorScreenComponent,
  argTypes: {
    onSelectPlayers: { action: 'select' },
  },
} as Meta;

export const Primary: ComponentStory<
  typeof NightPhaseConspiratorScreenComponent
> = (args) => {
  return <NightPhaseConspiratorScreenComponent {...args} />;
};

Primary.args = {
  players: [
    {
      userId: '1',
      name: 'Player 1',
    },
    {
      userId: '2',
      name: 'Player 2',
    },
    {
      userId: '3',
      name: 'Player 3',
    },
    {
      userId: '4',
      name: 'Player 4',
    },
  ],
};
