import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectPartyIsJoinable } from '../club-screen.selectors';
import { JoinPartyComponent } from './join-party.component';

export const JoinParty = () => {
  const clubScreenActor = useClubScreenActor();

  const isJoinable = useSelector(clubScreenActor, selectPartyIsJoinable);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{isJoinable && <JoinPartyComponent />}</>;
};
