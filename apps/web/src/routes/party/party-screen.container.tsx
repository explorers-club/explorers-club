import { useSelector } from '@xstate/react';
import { Box } from '@explorers-club/components/atoms/Box';
import { ConnectedContext } from '../../state/connected.context';
import { Connected } from './connected';
import { Connecting } from './connecting.component';
import { Disconnected } from './disconnected.component';
import {
  useActorManager,
  usePartyActor,
  usePartyScreenActor,
} from './party-screen.hooks';

export function PartyScreen() {
  const actor = usePartyScreenActor();
  const isConnecting = useSelector(actor, (state) =>
    state.matches('Connecting')
  );
  const isDisconnected = useSelector(actor, (state) =>
    state.matches('Disconnected')
  );
  const isConnected = useSelector(actor, (state) => state.matches('Connected'));

  // TODO delete these hooks and just use selectors
  // so we dont use them where we are not supposed to
  // only consume the actors/data through context
  const partyActor = usePartyActor();
  const actorManager = useActorManager();

  return (
    <Box>
      {isConnecting && <Connecting />}
      {isDisconnected && <Disconnected />}
      {isConnected && partyActor && actorManager && (
        <ConnectedContext.Provider value={{ partyActor, actorManager }}>
          <Connected />
        </ConnectedContext.Provider>
      )}
    </Box>
  );
}
