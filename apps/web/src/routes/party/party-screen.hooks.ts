import { PartyActor } from '@explorers-club/party';
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

/**
 * Should only be used by components when in the connected state, otherwise
 * will throw an exception
 * @returns the party actor
 */
export const usePartyActor = () => {
  const partyScreenActor = usePartyScreenActor();
  return useSelector(
    partyScreenActor,
    (state) => state.context.partyActor as PartyActor
  );
};

export const useActorManager = () => {
  const partyScreenActor = usePartyScreenActor();
  return useSelector(partyScreenActor, (state) => state.context.actorManager);
};
