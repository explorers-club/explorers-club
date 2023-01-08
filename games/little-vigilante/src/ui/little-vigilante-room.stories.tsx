import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';
import { ComponentMeta } from '@storybook/react';

export default {
  component: LittleVigilanteRoomComponent,
} as ComponentMeta<typeof LittleVigilanteRoomComponent>;

export const Default = () => {
  return <LittleVigilanteRoomComponent />;
};
