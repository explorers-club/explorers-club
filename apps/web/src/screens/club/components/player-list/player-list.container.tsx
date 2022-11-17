import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../../club-screen.hooks';
import { PlayerListComponent } from './player-list.component';

export const PlayerList = () => {
  const clubScreenActor = useClubScreenActor();

  return <Placeholder />;
  // const partyActor = useSelector(clubScreenActor, selectPartyActor);
  // const actorManager = useSelector(clubScreenActor, selectActorManager);

  // if (!partyActor) {
  //   return <Placeholder />;
  // }

  // return (
  //   <PlayerListComponent actorManager={actorManager} partyActor={partyActor} />
  // );
};

const Placeholder = () => <Box />;
