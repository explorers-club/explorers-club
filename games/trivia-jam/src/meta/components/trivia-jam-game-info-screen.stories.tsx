import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TriviaJamGameInfoScreenComponent } from './trivia-jam-game-info-screen.component';

export default {
  component: TriviaJamGameInfoScreenComponent,
} as Meta;

export const Primary: ComponentStory<
  typeof TriviaJamGameInfoScreenComponent
> = (args) => {
  return <TriviaJamGameInfoScreenComponent />;
};
