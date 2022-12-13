import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { AppComponent } from './app.component';

export default { component: AppComponent } as Meta;

export const Primary: ComponentStory<typeof AppComponent> = (args) => {
  return <AppComponent />;
};
