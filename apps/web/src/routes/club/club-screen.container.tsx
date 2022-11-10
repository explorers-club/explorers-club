import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../lib/logging';
import { Claimable } from './claimable.component';
import { Claiming } from './claiming.container';
import { useClubScreenActor } from './club-screen.hooks';
import { Container } from './club.styles';
import { DoesNotExist } from './does-not-exist.component';
import { Loading } from './loading.component';

export const ClubScreen = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);
  //   const { authActor } = useContext(GlobalStateContext);

  const playerName = useSelector(
    clubScreenActor,
    (state) => state.context.hostPlayerName
  );

  const isLoading = useSelector(clubScreenActor, (state) =>
    state.matches('Loading')
  );
  const isClaimable = useSelector(clubScreenActor, (state) =>
    state.matches('Unclaimed.Claimable')
  );
  const doesNotExist = useSelector(clubScreenActor, (state) =>
    state.matches('Unclaimed.NotExist')
  );
  const isClaiming = useSelector(clubScreenActor, (state) =>
    state.matches('Unclaimed.Claiming')
  );

  if (!playerName) {
    return <Container>error parsing URL</Container>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (doesNotExist) {
    return <DoesNotExist />;
  }

  if (isClaimable) {
    return <Claimable />;
  }

  if (isClaiming) {
    return <Claiming />;
  }

  return <Party hostPlayerName={playerName} />;
};

const Party = ({ hostPlayerName }: { hostPlayerName: string }) => {
  return <Container>{hostPlayerName}</Container>;
};
