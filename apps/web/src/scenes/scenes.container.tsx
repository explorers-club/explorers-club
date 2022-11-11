import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../routes/club/club-screen.hooks';
import { ClubScreenActor } from '../routes/club/club-screen.machine';
import {
  selectActorManager,
  selectPartyActor,
} from '../routes/club/club-screen.selectors';
import { ConnectedContext } from '../state/connected.context';
import { Game } from './game';
import { Lobby } from './lobby';

export const Scenes = () => {
  const clubScreenActor = useClubScreenActor();

  if (!clubScreenActor) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return <AllScenes clubScreenActor={clubScreenActor} />;
};

const AllScenes = ({
  clubScreenActor,
}: {
  clubScreenActor: ClubScreenActor;
}) => {
  const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const actorManager = useSelector(clubScreenActor, selectActorManager);

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
