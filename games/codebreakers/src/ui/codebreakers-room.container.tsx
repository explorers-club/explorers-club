import { CodebreakersStore } from '@explorers-club/room';
import { FC } from 'react';
import { CodebreakersContext } from '../state/codebreakers.context';
import { CodebreakersRoomComponent } from './codebreakers-room.component';

interface Props {
  store: CodebreakersStore;
  myUserId: string;
}

export const CodebreakersRoom: FC<Props> = ({ store, myUserId }) => {
  return (
    <CodebreakersContext.Provider value={{ store, myUserId }}>
      <CodebreakersRoomComponent />
    </CodebreakersContext.Provider>
  );
};
