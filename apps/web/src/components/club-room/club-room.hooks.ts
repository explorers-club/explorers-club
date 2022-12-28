import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ClubRoomContext } from './club-room.context';

export const useClubStore = () => {
  const service = useContext(ClubRoomContext);
  return useSelector(service, (state) => state.context.store);
};

export const useMyUserId = () => {
  const service = useContext(ClubRoomContext);
  return useSelector(service, (state) => state.context.myUserId);
};

export const useIsHost = () => {
  const store = useClubStore();
  const myUserId = useMyUserId();
  return myUserId === store.getSnapshot().hostUserId;
};
