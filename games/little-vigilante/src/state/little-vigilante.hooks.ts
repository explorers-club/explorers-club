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

export const useLittleVigilanteSelector = <T>(
  selector: (state: LittleVigilanteStateSerialized) => T
) => {
  const { store } = useContext(LittleVigilanteContext);
  return useStoreSelector(store, selector);
};
