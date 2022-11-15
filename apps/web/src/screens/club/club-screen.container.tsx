import { useSelector } from '@xstate/react';
import { memo } from 'react';
import { useActorLogger } from '../../lib/logging';
import { Claimable } from './claimable.component';
import { useClubScreenActor } from './club-screen.hooks';
import { selectIsClaimable } from './club-screen.selectors';
import { Connected } from './connected.container';
import { EnterName } from './enter-name';

export const ClubScreen = memo(() => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);

  const isClaimable = useSelector(clubScreenActor, selectIsClaimable);
  const isEnteringName = useSelector(clubScreenActor, (state) => {
    return state.matches('Connected.EnteringName');
  });

  // TODO refactor how the business logic works on this
  // instead of if/returns, considering using a switch or conditional rendering
  if (isClaimable) {
    return <Claimable />;
  }

  if (isEnteringName) {
    return <EnterName />;
  }

  return <Connected />;
});
