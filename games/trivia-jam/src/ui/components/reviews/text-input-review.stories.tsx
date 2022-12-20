import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TextInputReviewComponent } from './text-input-review.component';

export default { component: TextInputReviewComponent } as Meta;

export const Primary: ComponentStory<typeof TextInputReviewComponent> = (
  args
) => {
  return <TextInputReviewComponent />;
};
