import {
  LittleVigilanteCommand,
  LittleVigilanteStore,
  ServerEvent,
} from '@explorers-club/room';
import { FC } from 'react';
import { Observable } from 'rxjs';
import { LittleVigilanteContext } from '../state/little-vigilante.context';
import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';
import { ChatServiceProvider } from './organisms/chat.context';

interface Props {
  store: LittleVigilanteStore;
  myUserId: string;
  event$: Observable<ServerEvent<LittleVigilanteCommand>>;
}

export const LittleVigilanteRoom: FC<Props> = ({ store, myUserId, event$ }) => {
  return (
    <LittleVigilanteContext.Provider value={{ store, myUserId, event$ }}>
      <ChatServiceProvider>
        <LittleVigilanteRoomComponent />
      </ChatServiceProvider>
    </LittleVigilanteContext.Provider>
  );
};
