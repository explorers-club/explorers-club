import { createContext } from 'react';
import { ClaimClubScreenActor } from './claim-club-screen.machine';

export const ClaimClubContext = createContext({
  actor: {} as ClaimClubScreenActor,
});
