import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { LittleVigilanteConfigurationScreenComponent } from './little-vigilante-configuration-screen.component';

export default {
  component: LittleVigilanteConfigurationScreenComponent,
} as Meta;

export const Primary: ComponentStory<
  typeof LittleVigilanteConfigurationScreenComponent
> = (args) => {
  return <LittleVigilanteConfigurationScreenComponent />;
};
