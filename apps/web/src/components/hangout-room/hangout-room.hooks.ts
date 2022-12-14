import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { HangoutRoomContext } from './hangout-room.context';

export const useHangoutRoom = () => {
  const service = useContext(HangoutRoomContext);
  return useSelector(service, (state) => state.context.room);
};
