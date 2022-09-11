import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from './global.provider';
import { selectPartyConnectionActor } from './party.selectors';

export const usePartyConnection = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectPartyConnectionActor);
};
