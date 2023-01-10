import {
  LittleVigilanteStateSerialized,
  useStoreSelector,
} from '@explorers-club/room';
import { useContext } from 'react';
import { LittleVigilanteContext } from './little-vigilante.context';

export const useMyUserId = () => {
  const { myUserId } = useContext(LittleVigilanteContext);
  return myUserId;
};

export const useIsHost = () => {
  const { myUserId } = useContext(LittleVigilanteContext);
  return useLittleVigilanteSelector((state) =>
    state.hostUserIds.includes(myUserId)
  );
};

export const useLittleVigilanteSend = () => {
  const { store } = useContext(LittleVigilanteContext);
  return store.send;
};

export const useLittleVigilanteSelector = <T>(
  selector: (state: LittleVigilanteStateSerialized) => T
) => {
  const { store } = useContext(LittleVigilanteContext);
  return useStoreSelector(store, selector);
};
