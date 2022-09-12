import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from './global.provider';
import { selectPartyActor } from './party-connection.selectors';
import { selectPartyConnectionActor } from './party.selectors';

export const usePartyConnection = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectPartyConnectionActor);
};

export const useParty = () => {
  const partyConnectionActor = usePartyConnection();
  return useSelector(partyConnectionActor, selectPartyActor);
};
