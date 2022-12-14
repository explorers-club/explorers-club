import { ComponentStory, Meta } from '@storybook/react';
import { HangoutRoomComponent } from './hangout-room.component';

export default { component: HangoutRoomComponent } as Meta;

export const Primary: ComponentStory<typeof HangoutRoomComponent> = (args) => {
  return <HangoutRoomComponent />;
};
