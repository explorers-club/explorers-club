import { ComponentStory, Meta } from '@storybook/react';
import { ClubRoomComponent } from './club-room.component';

export default { component: ClubRoomComponent } as Meta;

export const Primary: ComponentStory<typeof ClubRoomComponent> = (args) => {
  return <ClubRoomComponent />;
};
