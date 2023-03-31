// import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
// import { Room } from 'colyseus.js';
// import { useCallback } from 'react';
// import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

// export const useRoomSelector = <T>(
//   room: Room<TriviaJamState>,
//   selector: (state: TriviaJamState) => T
// ) => {
//   const subscribe = useCallback(
//     (callback: () => void) => {
//       const emitter = room.onStateChange(callback);
//       return () => emitter.remove(callback);
//     },
//     [room]
//   );

//   const getSnapshot = useCallback(() => {
//     return room.state;
//   }, [room]);

//   return useSyncExternalStoreWithSelector(
//     subscribe,
//     getSnapshot,
//     getSnapshot,
//     selector
//   );
// };
