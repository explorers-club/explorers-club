import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { QuestionScreenComponent } from './question-screen.component';

export default { component: QuestionScreenComponent } as Meta;

export const Primary: ComponentStory<typeof QuestionScreenComponent> = (
  args
) => {
  return <QuestionScreenComponent />;
};
