import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { SummaryScreenComponent } from './summary-screen.component';

export default { component: SummaryScreenComponent } as Meta;

export const Primary: ComponentStory<typeof SummaryScreenComponent> = (
  args
) => {
  return <SummaryScreenComponent />;
};
