import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { IntroductionScreenComponent } from './introduction-screen.component';

export default { component: IntroductionScreenComponent } as Meta;

export const Primary: ComponentStory<typeof IntroductionScreenComponent> = (
  args
) => {
  return <IntroductionScreenComponent />;
};
