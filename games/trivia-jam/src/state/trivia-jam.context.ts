import { createContext } from 'react';
import { TriviaJamStore } from '../types';

export const TriviaJamContext = createContext({
  store: {} as TriviaJamStore,
  myUserId: '' as string,
});
