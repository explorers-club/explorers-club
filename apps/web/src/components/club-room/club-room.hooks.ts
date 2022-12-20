import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { AuthContext } from '../../state/auth.context';
import { ClubRoomContext } from './club-room.context';

export const useClubRoom = () => {
  const service = useContext(ClubRoomContext);
  return useSelector(service, (state) => state.context.room);
};

export const useIsHost = () => {
  const clubRoom = useClubRoom();
  const { userId } = useContext(AuthContext);
  return clubRoom.state.hostUserId === userId;
};
