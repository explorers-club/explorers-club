import { createContext } from 'react';
import { LobbyActor } from './lobby.machine';

export const LobbyServiceContext = createContext<LobbyActor>({} as LobbyActor);
