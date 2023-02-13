import {
  LittleVigilanteStateSerialized,
  LittleVigilanteStore,
  useStoreSelector,
} from '@explorers-club/room';
import { deepEqual } from '@explorers-club/utils';
import { useObservableEagerState, useObservableState } from 'observable-hooks';
import { useContext, useMemo, useState } from 'react';
import { distinctUntilChanged, map, Observable } from 'rxjs';
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
  
  // const store$ = fromStore(store);
  // const [state$] = useState(
  //   store$.pipe(map(selector), distinctUntilChanged(deepEqual))
  // );
  // return useObservableEagerState(state$);
};

// function fromStore(store: LittleVigilanteStore) {
//   return new Observable<LittleVigilanteStateSerialized>(function (observer) {
//     observer.next(store.getSnapshot());

//     const unsubscribe = store.subscribe(function () {
//       observer.next(store.getSnapshot());
//     });
//     return unsubscribe;
//   });
// }
