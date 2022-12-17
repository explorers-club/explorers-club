import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MainScreenComponent } from './main-screen.component';

export default { component: MainScreenComponent } as Meta;

export const Primary: ComponentStory<typeof MainScreenComponent> = (args) => {
  return <MainScreenComponent />;
};
