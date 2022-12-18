import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';

export default { component: ScoreboardScreenComponent } as Meta;

export const Primary: ComponentStory<typeof ScoreboardScreenComponent> = (
  args
) => {
  return <ScoreboardScreenComponent />;
};
