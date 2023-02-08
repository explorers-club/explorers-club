import {
  LittleVigilanteCommand,
  LittleVigilanteStore,
  ServerEvent,
} from '@explorers-club/room';
import { ContextProps } from '@explorers-club/utils';
import { createContext } from 'react';
import { Observable } from 'rxjs';

export const LittleVigilanteContext = createContext({
  store: {} as LittleVigilanteStore,
  myUserId: '' as string,
  event$: {} as Observable<ServerEvent<LittleVigilanteCommand>>,
});

export type LittleVigilanteContextProps = ContextProps<
  typeof LittleVigilanteContext
>;
