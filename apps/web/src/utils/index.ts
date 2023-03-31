import { AnyFunction } from 'xstate';

export const getClubNameFromPath = () => {
  const pathTokens = window.location.pathname.split('/');
  const clubName = pathTokens[1] !== '' ? pathTokens[1] : undefined;
  return clubName;
};

// export function useSelector<
//   Observable<T>,
//   TActor extends ActorRef<any, any>,
//   T,
//   TEmitted = TActor extends Subscribable<infer Emitted> ? Emitted : never
// >(
//   actor: TActor,
//   selector: (emitted: TEmitted) => T,
//   compare: (a: T, b: T) => boolean = defaultCompare,
//   getSnapshot?: (a: TActor) => TEmitted
// ): T {
//   const initialStateCacheRef = useRef<AnyState | null>(null);

//   const subscribe = useCallback(
//     (handleStoreChange) => {
//       const { unsubscribe } = actor.subscribe(handleStoreChange);
//       return unsubscribe;
//     },
//     [actor]
//   );

//   const boundGetSnapshot = useCallback(() => {
//     if (getSnapshot) {
//       return getSnapshot(actor);
//     }
//     return defaultGetSnapshot(actor, initialStateCacheRef);
//   }, [actor, getSnapshot]);

//   const selectedSnapshot = useSyncExternalStoreWithSelector(
//     subscribe,
//     boundGetSnapshot,
//     boundGetSnapshot,
//     selector,
//     compare
//   );

//   return selectedSnapshot;
// }