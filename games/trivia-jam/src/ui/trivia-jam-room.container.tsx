import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus.js';
import { FC, useMemo } from 'react';
import { TriviaJamContext } from '../state/trivia-jam.context';
import { createRoomStore } from '../state/trivia-jam.store';
import { TriviaJamRoomComponent } from './trivia-jam-room.component';

interface Props {
  room: Room<TriviaJamState>;
  myUserId: string;
}

export const TriviaJamRoom: FC<Props> = ({ room, myUserId }) => {
  const store = useMemo(() => createRoomStore(room), [room]);

  return (
    <TriviaJamContext.Provider value={{ store, myUserId }}>
      <TriviaJamRoomComponent />
    </TriviaJamContext.Provider>
  );
};
