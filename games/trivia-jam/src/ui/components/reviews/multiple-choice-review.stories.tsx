import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MultipleChoiceReviewComponent } from './multiple-choice-review.component';

export default { component: MultipleChoiceReviewComponent } as Meta;

export const Primary: ComponentStory<typeof MultipleChoiceReviewComponent> = (
  args
) => {
  return <MultipleChoiceReviewComponent />;
};
