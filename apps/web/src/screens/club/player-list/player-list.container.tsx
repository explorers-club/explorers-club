import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectPartyActor, selectActorManager } from '../club-screen.selectors';
import { PlayerListComponent } from './player-list.component';

export const PlayerList = () => {
  const clubScreenActor = useClubScreenActor();

  const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const actorManager = useSelector(clubScreenActor, selectActorManager);

  if (!partyActor) {
    return <Placeholder />;
  }

  return (
    <PlayerListComponent actorManager={actorManager} partyActor={partyActor} />
  );
};

const Placeholder = () => <Box />;
