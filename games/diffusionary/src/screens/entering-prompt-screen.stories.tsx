import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { EnteringPromptScreenComponent } from './entering-prompt-screen.component';

export default { component: EnteringPromptScreenComponent } as Meta;

export const Primary: ComponentStory<typeof EnteringPromptScreenComponent> = (
  args
) => {
  return <EnteringPromptScreenComponent />;
};
