import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../screens/club/club-screen.hooks';
import {
  ClubScreenActor,
  selectActorManager,
  selectPartyActor,
} from '../screens/club';
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
