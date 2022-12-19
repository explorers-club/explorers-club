import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { TriviaJamRoomContext } from './trivia-jam-room.context';

export const useTriviaJamRoom = () => {
  const { service } = useContext(TriviaJamRoomContext);
  return useSelector(service, (state) => state.context.room);
};

export const useMyUserId = () => {
  const { myUserId } = useContext(TriviaJamRoomContext);
  return myUserId;
};
