import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TrueOrFalseReviewComponent } from './true-or-false-review.component';

export default { component: TrueOrFalseReviewComponent } as Meta;

export const Primary: ComponentStory<typeof TrueOrFalseReviewComponent> = (
  args
) => {
  return <TrueOrFalseReviewComponent />;
};
