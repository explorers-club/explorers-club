import { ComponentStory, Meta } from '@storybook/react';
import { NightPhasePoliticianScreenComponent } from './night-phase-politician-screen.component';

export default {
  component: NightPhasePoliticianScreenComponent,
  argTypes: { onSelectPlayer: { actions: 'select' } },
} as Meta;

export const Primary: ComponentStory<
  typeof NightPhasePoliticianScreenComponent
> = (args) => {
  return <NightPhasePoliticianScreenComponent {...args} />;
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
