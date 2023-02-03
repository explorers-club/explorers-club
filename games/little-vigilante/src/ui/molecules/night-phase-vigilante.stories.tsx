import { ComponentStory, Meta } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { NightPhaseVigilanteComponent } from './night-phase-vigilante.component';

export default {
  component: NightPhaseVigilanteComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NightPhaseVigilanteComponent> = (args) => {
  return <NightPhaseVigilanteComponent unusedRole="anarchist" />;
};
