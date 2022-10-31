import { PartyActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { usePartyScreenActor } from '../routes/party/party-screen.hooks';
import { PartyScreenActor } from '../routes/party/party-screen.machine';
import { ConnectedContext } from '../state/connected.context';
import { Game } from './game';
import { Lobby } from './lobby';

export const Scenes = () => {
  const partyScreenActor = usePartyScreenActor();

  if (!partyScreenActor) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return <AllScenes partyScreenActor={partyScreenActor} />;
};

const AllScenes = ({
  partyScreenActor,
}: {
  partyScreenActor: PartyScreenActor;
}) => {
  const partyActor = useSelector(
    partyScreenActor,
    (state) => state.context.partyActor as PartyActor | undefined
  );
  const actorManager = useSelector(
    partyScreenActor,
    (state) => state.context.actorManager
  );

  if (!partyActor) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <ConnectedContext.Provider value={{ partyActor, actorManager }}>
      <Lobby />
      <Game />
    </ConnectedContext.Provider>
  );
};
