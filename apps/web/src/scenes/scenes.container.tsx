import {
  ClubScreenActor
} from '../screens/club';
import { useClubScreenActor } from '../screens/club/club-screen.hooks';

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
  // TODO add back in to get scene back when we update how the actors are selected
  // const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const partyActor = undefined;
  // const actorManager = useSelector(clubScreenActor, selectActorManager);

  if (!partyActor) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    null
    // <ConnectedContext.Provider value={{ partyActor, actorManager }}>
    //   <Lobby />
    //   <Game />
    // </ConnectedContext.Provider>
  )
};
