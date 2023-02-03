import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseArrestedComponent } from './night-phase-arrested.component';

export default {
  component: NightPhaseArrestedComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseArrestedComponent> = (
  args
) => {
  return <NightPhaseArrestedComponent />;
};
