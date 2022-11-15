import { useSelector } from '@xstate/react';
import { memo } from 'react';
import { useActorLogger } from '../../lib/logging';
import { ClaimableScreen } from './claimable';
import { useClubScreenActor } from './club-screen.hooks';
import { selectIsClaimable } from './club-screen.selectors';
import { ConnectedScreen } from './connected';
import { EnterNameScreen } from './enter-name';

export const ClubScreen = memo(() => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);

  const isClaimable = useSelector(clubScreenActor, selectIsClaimable);
  const isEnteringName = useSelector(clubScreenActor, (state) => {
    return state.matches('Connected.EnteringName');
  });

  // TODO rename these to Screens
  if (isClaimable) {
    return <ClaimableScreen />;
  }

  if (isEnteringName) {
    return <EnterNameScreen />;
  }

  return <ConnectedScreen />;
});
