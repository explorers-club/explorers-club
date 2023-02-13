import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseConArtistComponent } from './night-phase-con-artist.component';

export default {
  component: NightPhaseConArtistComponent,
  decorators: [withCardDecorator],
  argTypes: { onSelectPlayer: { actions: 'select' } },
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseConArtistComponent> = (
  args
) => {
  return <NightPhaseConArtistComponent {...args} />;
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
