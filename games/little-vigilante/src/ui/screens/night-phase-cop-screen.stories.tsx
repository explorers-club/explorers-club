import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseCopScreenComponent } from './night-phase-cop-screen.component';

export default {
  component: NightPhaseCopScreenComponent,
  argTypes: {
    onSelectPlayer: { action: 'select' },
  },
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseCopScreenComponent> = (
  args
) => {
  return <NightPhaseCopScreenComponent {...args} />;
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
