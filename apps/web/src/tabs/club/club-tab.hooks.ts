import { ClubStateSerialized, useStoreSelector } from '@explorers-club/room';
import { useContext } from 'react';
import { AuthContext } from '../../state/auth.context';
import { ClubTabContext } from './club-tab.context';

export const useSend = () => {
  const { store } = useContext(ClubTabContext);
  return store.send;
};

export const useClubStoreSelector = <T>(
  selector: (state: ClubStateSerialized) => T
) => {
  const { store } = useContext(ClubTabContext);
  return useStoreSelector(store, selector);
};

export const useIsHost = () => {
  const { userId } = useContext(AuthContext);
  const hostUserId = useClubStoreSelector((state) => state.hostUserId);
  return userId === hostUserId;
};
