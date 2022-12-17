import { TriviaJamRoomComponent } from './trivia-jam-room.component';
import { Room } from 'colyseus.js';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { FC } from 'react';

interface Props {
  room: Room<TriviaJamState>;
}

export const TriviaJamRoom: FC<Props> = () => {
  return <TriviaJamRoomComponent />;
};
