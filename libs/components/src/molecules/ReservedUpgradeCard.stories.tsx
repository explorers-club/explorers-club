import { ComponentStory } from '@storybook/react';
import { ReservedUpgradeCard } from './ReservedUpgradeCard';

export default {
  component: ReservedUpgradeCard,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Default: ComponentStory<typeof ReservedUpgradeCard> = (args) => {
  return <ReservedUpgradeCard {...args} />;
};

Default.args = {
  playerName: 'Jambalaya22',
};
