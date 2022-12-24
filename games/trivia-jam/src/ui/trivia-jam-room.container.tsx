import { TriviaJamStore } from '@explorers-club/room';
import { FC } from 'react';
import { TriviaJamContext } from '../state/trivia-jam.context';
import { TriviaJamRoomComponent } from './trivia-jam-room.component';

interface Props {
  store: TriviaJamStore;
  myUserId: string;
}

export const TriviaJamRoom: FC<Props> = ({ store, myUserId }) => {
  return (
    <TriviaJamContext.Provider value={{ store, myUserId }}>
      <TriviaJamRoomComponent />
    </TriviaJamContext.Provider>
  );
};
