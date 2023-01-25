import { ComponentStory, Meta } from '@storybook/react';
import { NightPhaseButlerScreenComponent } from './night-phase-butler-screen.component';

export default { component: NightPhaseButlerScreenComponent } as Meta;

export const Primary: ComponentStory<typeof NightPhaseButlerScreenComponent> = (
  args
) => {
  return <NightPhaseButlerScreenComponent vigilante="Jambalaya22" />;
};
