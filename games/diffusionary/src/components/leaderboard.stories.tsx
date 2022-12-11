import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { LeaderboardComponent } from './leaderboard.component';

export default { component: LeaderboardComponent } as Meta;

export const Primary: ComponentStory<typeof LeaderboardComponent> = (args) => {
  return <LeaderboardComponent />;
};
