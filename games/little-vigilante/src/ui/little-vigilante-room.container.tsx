import { LittleVigilanteStore } from '@explorers-club/room';
import { FC } from 'react';
import { LittleVigilanteContext } from '../state/little-vigilante.context';
import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';

interface Props {
  store: LittleVigilanteStore;
  myUserId: string;
}

export const LittleVigilanteRoom: FC<Props> = ({ store, myUserId }) => {
  return (
    <LittleVigilanteContext.Provider value={{ store, myUserId }}>
      <LittleVigilanteRoomComponent />
    </LittleVigilanteContext.Provider>
  );
};
