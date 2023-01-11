import { ComponentStory } from '@storybook/react';
import { VotingPhaseScreenComponent } from './voting-phase-screen.component';

export default {
  component: VotingPhaseScreenComponent,
  argTypes: { onSubmitVote: { action: 'submitted' } },
};

const Template: ComponentStory<typeof VotingPhaseScreenComponent> = (args) => (
  <VotingPhaseScreenComponent {...args} />
);

export const Default = Template.bind({});

Default.args = {
  timeRemaining: 30,
  playerVoteCounts: [
    {
      name: 'Alice',
      userId: 'alice',
      count: 1,
    },
    {
      name: 'Bob',
      userId: 'bob',
      count: 0,
    },
    {
      name: 'Charlie',
      userId: 'charlie',
      count: 2,
    },
  ],
};
