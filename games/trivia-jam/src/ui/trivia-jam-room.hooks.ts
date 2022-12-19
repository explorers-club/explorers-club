import { useContext, useEffect, useState } from 'react';
import { TriviaJamRoomContext } from './trivia-jam-room.context';

export const useTriviaJamRoom = () => {
  const { room } = useContext(TriviaJamRoomContext);
  return room;
};

export const useMyUserId = () => {
  const { myUserId } = useContext(TriviaJamRoomContext);
  return myUserId;
};

// type NonFunctionPropNames<T> = {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   [K in keyof T]: T[K] extends Function ? never : K;
// }[keyof T];

// public listen <K extends NonFunctionPropNames<this>>(attr: K, callback: (value: this[K], previousValue: this[K]) => void) {
//     if (!this.$listeners[attr as string]) {
//         this.$listeners[attr as string] = new EventEmitter_();
//     }
//     this.$listeners[attr as string].register(callback);

//     // return un-register callback.
//     return () =>
//         this.$listeners[attr as string].remove(callback);
// }

// export function useValue<K extends NonFunctionPropNames<TriviaJamState>>(
//   room: Room<TriviaJamState>,
//   attr: K
// ) {
//   const initial: TriviaJamState[K] = room.state[attr];
//   const [value, setValue] = useState<TriviaJamState[K]>(initial);
//   useEffect(() => {
//     const unsub = room.state.listen(attr, (newValue) => {
//       setValue(newValue);
//     });
//     return unsub;
//   });
//   return value;
// }

export const useCurrentStates = () => {
  const room = useTriviaJamRoom();

  const [states, setStates] = useState(
    Array.from(room.state.currentStates.values())
  );

  useEffect(() => {
    // todo remove on unmount
    room.onStateChange((state) => {
      setStates(Array.from(state.currentStates.values()));
    });
  });

  return states;
};
