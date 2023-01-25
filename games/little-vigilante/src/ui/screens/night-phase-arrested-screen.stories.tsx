import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseArrestedScreenComponent } from './night-phase-arrested-screen.component';

export default { component: NightPhaseArrestedScreenComponent } as Meta;

export const Primary: ComponentStory<
  typeof NightPhaseArrestedScreenComponent
> = (args) => {
  return <NightPhaseArrestedScreenComponent />;
};
