import { ComponentStory } from '@storybook/react';
import { SummaryScreenComponent } from './summary-screen.component';

export default {
  component: SummaryScreenComponent,
};

export const Default: ComponentStory<typeof SummaryScreenComponent> = (
  args
) => {
  return <SummaryScreenComponent />;
};
