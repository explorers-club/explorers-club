import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { useEffect, useState } from 'react';
import { Room } from 'colyseus.js';

export function useRoomStateSelector<TState extends TriviaJamState, T>(
  room: Room<TState>,
  selector: (state: TState) => T
): T {
  const [value, setValue] = useState<T>(selector(room.state));
  useEffect(() => {
    room.onStateChange.once((state) => {
      setValue(selector(state));
    });
    room.onStateChange((state) => {
      setValue(selector(state));
    });
  }, [room, setValue, selector]);
  return value;
}
