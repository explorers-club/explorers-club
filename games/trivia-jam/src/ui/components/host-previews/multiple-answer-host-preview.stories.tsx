import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MultipleAnswerHostPreviewComponent } from './multiple-answer-host-preview.component';

export default { component: MultipleAnswerHostPreviewComponent } as Meta;

export const Primary: ComponentStory<
  typeof MultipleAnswerHostPreviewComponent
> = (args) => {
  return <MultipleAnswerHostPreviewComponent />;
};
