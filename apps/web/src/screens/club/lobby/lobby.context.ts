import { createContext } from 'react';
import { LobbyScreenActor } from './lobby-screen.machine';

export const LobbyContext = createContext({
  actor: {} as LobbyScreenActor,
});
