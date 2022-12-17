import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ClubRoomContext } from './club-room.context';

export const useClubRoom = () => {
  const service = useContext(ClubRoomContext);
  return useSelector(service, (state) => state.context.room);
};
