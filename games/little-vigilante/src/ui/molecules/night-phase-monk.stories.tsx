import { ComponentStory, Meta } from '@storybook/react';
import { NightPhaseMonkComponent } from './night-phase-monk.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: NightPhaseMonkComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseMonkComponent> = (args) => {
  // eslint-disable-next-line jsx-a11y/aria-role
  return <NightPhaseMonkComponent role="Vigilante" />;
};
