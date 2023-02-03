import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { LittleVigilanteConfigurationScreenComponent } from './little-vigilante-configuration-screen.component';

export default {
  component: LittleVigilanteConfigurationScreenComponent,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  actionTypes: {
    onSubmitConfig: { type: 'action' },
  },
} as Meta;

export const Primary: ComponentStory<
  typeof LittleVigilanteConfigurationScreenComponent
> = (args) => {
  return <LittleVigilanteConfigurationScreenComponent {...args} />;
};

Primary.args = {
  initialConfig: {
    gameId: 'little_vigilante',
    minPlayers: 4,
    maxPlayers: 10,
    discussionTimeSeconds: 60,
    votingTimeSeconds: 60,
    roundsToPlay: 5,
  },
};
