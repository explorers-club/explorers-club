import { createContext } from 'react';
import { TriviaJamStore } from '@explorers-club/room';

export const TriviaJamContext = createContext({
  store: {} as TriviaJamStore,
  myUserId: '' as string,
});
