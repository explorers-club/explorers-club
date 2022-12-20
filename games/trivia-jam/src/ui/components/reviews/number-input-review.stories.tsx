import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NumberInputReviewComponent } from './number-input-review.component';

export default { component: NumberInputReviewComponent } as Meta;

export const Primary: ComponentStory<typeof NumberInputReviewComponent> = (
  args
) => {
  return <NumberInputReviewComponent />;
};
