import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseAnarchistComponent } from './night-phase-anarchist.component';

export default {
  component: NightPhaseAnarchistComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseAnarchistComponent> = (args) => {
  return <NightPhaseAnarchistComponent />;
};
