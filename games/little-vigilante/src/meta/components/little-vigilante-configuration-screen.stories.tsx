import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { LittleVigilanteConfigurationScreenComponent } from './little-vigilante-configuration-screen.component';

export default {
  component: LittleVigilanteConfigurationScreenComponent,
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
    maxPlayers: 10,
    discussionTimeSeconds: 60,
    votingTimeSeconds: 60,
  },
};
