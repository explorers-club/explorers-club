import { useSelector } from '@xstate/react';
import { Claiming } from './claiming.container';
import { useClubScreenActor } from './club-screen.hooks';
import { UnclaimedComponent } from './unclaimed.component';

export const Unclaimed = () => {
  const actor = useClubScreenActor();
  const playerName = useSelector(
    actor,
    (state) => state.context.hostPlayerName
  );
  const isClaiming = useSelector(actor, (state) =>
    state.matches('Unclaimed.Claiming')
  );

  if (isClaiming) {
    return <Claiming />;
  }

  return <UnclaimedComponent playerName={playerName} />;
};
