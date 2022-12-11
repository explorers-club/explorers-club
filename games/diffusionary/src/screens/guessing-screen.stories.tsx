import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { GuessingScreenComponent } from './guessing-screen.component';

export default { component: GuessingScreenComponent } as Meta;

export const Primary: ComponentStory<typeof GuessingScreenComponent> = (
  args
) => {
  return <GuessingScreenComponent />;
};
