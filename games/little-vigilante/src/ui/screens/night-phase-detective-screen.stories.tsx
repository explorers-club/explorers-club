import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseDetectiveScreenComponent } from './night-phase-detective-screen.component';

export default { component: NightPhaseDetectiveScreenComponent, argTypes: {
  onSelectPlayer: { action: 'select' },
} } as Meta;

export const Primary: ComponentStory<
  typeof NightPhaseDetectiveScreenComponent
> = (args) => {
  return <NightPhaseDetectiveScreenComponent {...args} />;
};

Primary.args = {
  players: [
    {
      userId: '1',
      name: 'Player 1',
      role: 'Vigilante',
    },
    {
      userId: '2',
      name: 'Player 2',
      role: 'Student',
    },
    {
      userId: '3',
      name: 'Player 3',
      role: 'Monk',
    },
    {
      userId: '4',
      name: 'Player 4',
      role: 'Student',
    },
  ],
};