import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../lib/logging';
import { ConnectedContext } from '../../state/connected.context';
import { useClubScreenActor } from './club-screen.hooks';
import { selectActorManager, selectPartyActor } from './club-screen.selectors';
import { ConnectedComponent } from './connected.component';

// const selectShowJoin = createSelector(selectIsJoined, selectIs)

export const Connected = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);
  const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const actorManager = useSelector(clubScreenActor, selectActorManager);

  return (
    <ConnectedContext.Provider value={{ actorManager, partyActor }}>
      <ConnectedComponent />
    </ConnectedContext.Provider>
  );
};
