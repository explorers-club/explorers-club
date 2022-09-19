import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { selectPartyScreenActor } from './party-screen.selectors';

export const usePartyScreenActor = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectPartyScreenActor);
};

export const usePartyScreenState = () => {
  const partyScreenActor = usePartyScreenActor();
  return useSelector(partyScreenActor, (state) => state);
};
