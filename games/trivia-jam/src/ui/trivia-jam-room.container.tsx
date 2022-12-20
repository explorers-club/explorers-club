import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus.js';
import { FC } from 'react';
import { TriviaJamRoomComponent } from './trivia-jam-room.component';
import { TriviaJamContext } from '../state/trivia-jam.context';

interface Props {
  room: Room<TriviaJamState>;
  myUserId: string;
}

export const TriviaJamRoom: FC<Props> = ({ room, myUserId }) => {
  return (
    <TriviaJamContext.Provider value={{ room, myUserId }}>
      <TriviaJamRoomComponent />
    </TriviaJamContext.Provider>
  );
};
