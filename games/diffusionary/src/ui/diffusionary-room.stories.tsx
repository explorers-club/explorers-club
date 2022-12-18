import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { DiffusionaryRoomComponent } from './diffusionary-room.component';

export default { component: DiffusionaryRoomComponent } as Meta;

export const Primary: ComponentStory<typeof DiffusionaryRoomComponent> = (
  args
) => {
  return <DiffusionaryRoomComponent />;
};
