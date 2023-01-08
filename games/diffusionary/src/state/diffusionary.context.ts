import { createContext } from 'react';
import { DiffusionaryStore } from '@explorers-club/room';

export const DiffusionaryContext = createContext({
  store: {} as DiffusionaryStore,
  myUserId: '' as string,
});
