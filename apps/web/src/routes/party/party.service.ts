import { createContext } from 'react';
import { PartyActor } from './party.machine';

export const PartyServiceContext = createContext<PartyActor>({} as PartyActor);
