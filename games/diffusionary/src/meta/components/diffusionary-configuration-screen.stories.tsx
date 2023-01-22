import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { DiffusionaryConfigurationScreenComponent } from './diffusionary-configuration-screen.component';

export default { component: DiffusionaryConfigurationScreenComponent } as Meta;

export const Primary: ComponentStory<
  typeof DiffusionaryConfigurationScreenComponent
> = (args) => {
  return <DiffusionaryConfigurationScreenComponent />;
};
