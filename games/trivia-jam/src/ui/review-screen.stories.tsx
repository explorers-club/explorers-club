import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { ReviewScreenComponent } from './review-screen.component';

export default { component: ReviewScreenComponent } as Meta;

export const Primary: ComponentStory<typeof ReviewScreenComponent> = (args) => {
  return <ReviewScreenComponent />;
};
