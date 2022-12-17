import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TriviaJamRoomComponent } from './trivia-jam-room.component';

export default { component: TriviaJamRoomComponent } as Meta;

export const Primary: ComponentStory<typeof TriviaJamRoomComponent> = (
  args
) => {
  return <TriviaJamRoomComponent />;
};
