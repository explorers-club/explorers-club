import { createContext } from 'react';
import { CodebreakersStore } from '@explorers-club/room';

export const CodebreakersContext = createContext({
  store: {} as CodebreakersStore,
  myUserId: '' as string,
});
