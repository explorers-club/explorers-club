import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseSidekickComponent } from './night-phase-sidekick.component';

export default {
  component: NightPhaseSidekickComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseSidekickComponent> = (args) => {
  return <NightPhaseSidekickComponent vigilante="Jambalay22" />;
};
