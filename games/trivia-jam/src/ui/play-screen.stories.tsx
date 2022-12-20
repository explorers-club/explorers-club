import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { PlayScreenComponent } from './play-screen.component';

export default { component: PlayScreenComponent } as Meta;

export const Primary: ComponentStory<typeof PlayScreenComponent> = (args) => {
  return <PlayScreenComponent />;
};
