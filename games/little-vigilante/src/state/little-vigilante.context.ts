import { createContext } from 'react';
import { LittleVigilanteStore } from '@explorers-club/room';

export const LittleVigilanteContext = createContext({
  store: {} as LittleVigilanteStore,
  myUserId: '' as string,
});
