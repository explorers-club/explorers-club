import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseArrested } from './night-phase-arrested.component';

export default {
  component: NightPhaseArrested,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseArrested> = (args) => {
  return <NightPhaseArrested />;
};
