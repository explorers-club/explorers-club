import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';

export const usePartyScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  return useSelector(
    navigationActor,
    (state) => state.children['partyScreenMachine']
  );
};

export const usePartyScreenState = () => {
  const partyScreenActor = usePartyScreenActor();
  return useSelector(partyScreenActor, (state) => state);
};
