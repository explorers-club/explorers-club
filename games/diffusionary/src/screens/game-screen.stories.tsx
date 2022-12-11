import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { GameScreenComponent } from './game-screen.component';

export default { component: GameScreenComponent } as Meta;

export const Primary: ComponentStory<typeof GameScreenComponent> = (args) => {
  return <GameScreenComponent />;
};
