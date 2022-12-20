import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MultipleChoiceHostPreviewComponent } from './multiple-choice-host-preview.component';

export default { component: MultipleChoiceHostPreviewComponent } as Meta;

export const Primary: ComponentStory<
  typeof MultipleChoiceHostPreviewComponent
> = (args) => {
  return <MultipleChoiceHostPreviewComponent />;
};
