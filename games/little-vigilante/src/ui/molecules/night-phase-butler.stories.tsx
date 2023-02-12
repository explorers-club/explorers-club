import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseButlerComponent } from './night-phase-butler.component';

export default {
  component: NightPhaseButlerComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseButlerComponent> = (
  args
) => {
  return <NightPhaseButlerComponent vigilante="Jambalaya22" />;
};

export const WithSidekick: ComponentStory<typeof NightPhaseButlerComponent> = (
  args
) => {
  return <NightPhaseButlerComponent vigilante="Jambalaya22" sidekick="Bob" />;
};
