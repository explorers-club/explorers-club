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

// export const useMyActorId = () => {
//   const { authActor } = useContext(GlobalStateContext);
//   const userId = useSelector(
//     authActor,
//     (state) => state.context.session?.user.id
//   );
//   // weird pattern here
//   if (!userId) {
//     throw new Error('trying to access actor id without being logged in');
//   }

//   const actorId = getPartyPlayerActorId(userId);
//   return actorId;
// };

/**
 * todo remove this, unsafe
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
