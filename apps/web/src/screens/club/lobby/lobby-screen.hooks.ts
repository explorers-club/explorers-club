import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectLobbyScreenActor } from '../club-screen.selectors';
import { selectSharedCollectionActor } from './lobby-screen.selectors';

export const useLobbyScreenActor = () => {
  const actor = useClubScreenActor();
  return useSelector(actor, selectLobbyScreenActor);
};

export const useSharedCollectionActor = () => {
  const actor = useLobbyScreenActor();
  return useSelector(actor, selectSharedCollectionActor);
};