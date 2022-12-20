import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus.js';
import { createContext } from 'react';

export const TriviaJamContext = createContext({
  room: {} as Room<TriviaJamState>,
  myUserId: '' as string,
});
