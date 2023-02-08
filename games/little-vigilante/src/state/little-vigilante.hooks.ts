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

// export const useLittleVigilanteStore$ = () => {
//   const { store } = useContext(LittleVigilanteContext);
//   useMemo(() => {
//     from(store);
//   }, [store]);
// };

export const useLittleVigilanteEvent$ = () => {
  const { event$ } = useContext(LittleVigilanteContext);
  return event$;
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
