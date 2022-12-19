import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus.js';
import { FC } from 'react';
import { TriviaJamRoomComponent } from './trivia-jam-room.component';
import { TriviaJamRoomContext } from './trivia-jam-room.context';

interface Props {
  room: Room<TriviaJamState>;
  myUserId: string;
}

export const TriviaJamRoom: FC<Props> = ({ room, myUserId }) => {
  return (
    <TriviaJamRoomContext.Provider value={{ room, myUserId }}>
      <TriviaJamRoomComponent />
    </TriviaJamRoomContext.Provider>
  );
};
