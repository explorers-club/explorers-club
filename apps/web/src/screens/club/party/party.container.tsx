import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectPartyActor, selectActorManager } from '../club-screen.selectors';
import { PlayerList } from './player-list.component';
import { PartyContext } from './party.context';

export const Party = () => {
  const clubScreenActor = useClubScreenActor();

  const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const actorManager = useSelector(clubScreenActor, selectActorManager);

  if (!partyActor) {
    return <Placeholder />;
  }

  return (
    <PartyContext.Provider value={{ actorManager, partyActor }}>
      <PlayerList />
    </PartyContext.Provider>
  );
};

const Placeholder = () => <Box />;
