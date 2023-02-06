import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseConspiratorComponent } from './night-phase-conspirator.component';

export default {
  component: NightPhaseConspiratorComponent,
  decorators: [withCardDecorator],
  argTypes: {
    onSelectPlayers: { action: 'select' },
  },
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseConspiratorComponent> = (args) => {
  return <NightPhaseConspiratorComponent {...args} />;
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
