import { ComponentStory, Meta } from '@storybook/react';
import { NightPhaseCopComponent } from './night-phase-cop.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: NightPhaseCopComponent,
  decorators: [withCardDecorator],
  argTypes: {
    onSelectPlayer: { action: 'select' },
  },
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseCopComponent> = (args) => {
  return <NightPhaseCopComponent {...args} />;
};

Primary.args = {
  players: [
    {
      userId: '1',
      name: 'Player 1',
      slotNumber: 1,
    },
    {
      userId: '2',
      name: 'Player 2',
      slotNumber: 2,
    },
    {
      userId: '3',
      name: 'Player 3',
      slotNumber: 3,
    },
    {
      userId: '4',
      name: 'Player 4',
      slotNumber: 4,
    },
  ],
};
