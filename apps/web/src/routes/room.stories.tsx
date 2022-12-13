import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { RoomComponent } from './room.component';

export default { component: RoomComponent } as Meta;

export const Primary: ComponentStory<typeof RoomComponent> = (args) => {
  return <RoomComponent />;
};
