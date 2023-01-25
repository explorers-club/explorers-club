import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseMonkScreenComponent } from './night-phase-monk-screen.component';

export default { component: NightPhaseMonkScreenComponent } as Meta;

export const Primary: ComponentStory<typeof NightPhaseMonkScreenComponent> = (
  args
) => {
  // eslint-disable-next-line jsx-a11y/aria-role
  return <NightPhaseMonkScreenComponent role="Vigilante" />;
};
