import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { DiffusionaryGameInfoScreenComponent } from './diffusionary-game-info-screen.component';

export default { component: DiffusionaryGameInfoScreenComponent } as Meta;

export const Primary: ComponentStory<
  typeof DiffusionaryGameInfoScreenComponent
> = (args) => {
  return <DiffusionaryGameInfoScreenComponent />;
};
