import { ComponentStory } from '@storybook/react';
import { DiscussionPhaseScreenComponent } from './discussion-phase-screen.component';

export default {
  component: DiscussionPhaseScreenComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Primary: ComponentStory<typeof DiscussionPhaseScreenComponent> = (
  args
) => {
  return <DiscussionPhaseScreenComponent {...args} />;
};

Primary.args = {
  timeRemaining: 120,
};
