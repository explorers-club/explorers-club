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
      name: 'Alice',
      slotNumber: 1,
    },
    {
      userId: '2',
      name: 'Bob',
      slotNumber: 2,
    },
    {
      userId: '3',
      name: 'Charlie',
      slotNumber: 4,
    },
    {
      userId: '4',
      name: 'Eve',
      slotNumber: 5,
    },
  ],
};
