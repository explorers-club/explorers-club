import { ComponentStory, Meta } from '@storybook/react';
import { NightPhaseVigilanteScreenComponent } from './night-phase-vigilante-screen.component';

export default { component: NightPhaseVigilanteScreenComponent } as Meta;

export const Primary: ComponentStory<
  typeof NightPhaseVigilanteScreenComponent
> = (args) => {
  return <NightPhaseVigilanteScreenComponent unusedRole='Butler' />;
};
