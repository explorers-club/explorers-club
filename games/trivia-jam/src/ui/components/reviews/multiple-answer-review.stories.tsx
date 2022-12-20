import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MultipleAnswerReviewComponent } from './multiple-answer-review.component';

export default { component: MultipleAnswerReviewComponent } as Meta;

export const Primary: ComponentStory<typeof MultipleAnswerReviewComponent> = (
  args
) => {
  return <MultipleAnswerReviewComponent />;
};
