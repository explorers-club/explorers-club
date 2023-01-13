import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NightPhaseSidekickScreenComponent } from './night-phase-sidekick-screen.component';

export default { component: NightPhaseSidekickScreenComponent } as Meta;

export const Primary: ComponentStory<
  typeof NightPhaseSidekickScreenComponent
> = (args) => {
  return <NightPhaseSidekickScreenComponent vigilante='Jambalay22' />;
};
