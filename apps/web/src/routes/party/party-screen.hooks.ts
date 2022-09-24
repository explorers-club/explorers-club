import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { PartyScreenActor } from './party-screen.machine';

export const usePartyScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  return useSelector(
    navigationActor,
    (state) => state.children['partyScreenMachine'] as PartyScreenActor
  );
};
