import { createContext } from 'react';
import { LittleVigilanteStore } from '@explorers-club/room';
import { ContextProps } from '@explorers-club/utils';

export const LittleVigilanteContext = createContext({
  store: {} as LittleVigilanteStore,
  myUserId: '' as string,
});

export type LittleVigilanteContextProps = ContextProps<
  typeof LittleVigilanteContext
>;
