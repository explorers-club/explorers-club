import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhasePoliticianComponent } from './night-phase-politician.component';

export default {
  component: NightPhasePoliticianComponent,
  decorators: [withCardDecorator],
  argTypes: { onSelectPlayer: { actions: 'select' } },
} as Meta;

export const Primary: ComponentStory<
  typeof NightPhasePoliticianComponent
> = (args) => {
  return <NightPhasePoliticianComponent {...args} />;
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
