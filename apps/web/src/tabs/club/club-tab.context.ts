import { createContext } from 'react';
import { ClubStore } from '@explorers-club/room';

export const ClubTabContext = createContext({
  store: {} as ClubStore,
});
