import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from './global.provider';
import { selectPartyActor } from './party.selectors';

export const usePartyActor = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectPartyActor);
};
