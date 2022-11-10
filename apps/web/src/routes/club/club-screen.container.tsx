import { useSelector } from '@xstate/react';
import { Claimable } from './claimable.component';
import { Claiming } from './claiming.container';
import { useClubScreenActor } from './club-screen.hooks';
import {
  selectDoesNotExist,
  selectHostPlayerName,
  selectIsClaimable,
  selectIsClaiming,
  selectIsLoading,
} from './club-screen.selectors';
import { Container } from './club.styles';
import { DoesNotExist } from './does-not-exist.component';
import { Loading } from './loading.component';

export const ClubScreen = () => {
  const clubScreenActor = useClubScreenActor();

  const playerName = useSelector(clubScreenActor, selectHostPlayerName);
  const isLoading = useSelector(clubScreenActor, selectIsLoading);
  const isClaimable = useSelector(clubScreenActor, selectIsClaimable);
  const doesNotExist = useSelector(clubScreenActor, selectDoesNotExist);
  const isClaiming = useSelector(clubScreenActor, selectIsClaiming);

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
