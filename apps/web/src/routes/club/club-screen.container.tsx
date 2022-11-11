import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../lib/logging';
import { Claimable } from './claimable.component';
import { Claiming } from './claiming.container';
import { useClubScreenActor } from './club-screen.hooks';
import {
  selectDoesNotExist,
  selectHostPlayerName,
  selectIsClaimable,
  selectIsClaiming,
  selectIsConnected,
  selectIsConnecting,
  selectIsLoading,
} from './club-screen.selectors';
import { Container } from './club.styles';
import { Connected } from './connected.container';
import { Connecting } from './connecting.component';
import { DoesNotExist } from './does-not-exist.component';
import { Loading } from './loading.component';

export const ClubScreen = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);

  const playerName = useSelector(clubScreenActor, selectHostPlayerName);
  const isLoading = useSelector(clubScreenActor, selectIsLoading);
  const isClaimable = useSelector(clubScreenActor, selectIsClaimable);
  const doesNotExist = useSelector(clubScreenActor, selectDoesNotExist);
  const isClaiming = useSelector(clubScreenActor, selectIsClaiming);
  const isConnecting = useSelector(clubScreenActor, selectIsConnecting);
  const isConnected = useSelector(clubScreenActor, selectIsConnected);

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

  if (isConnected) {
    return <Connected />;
  }

  if (isConnecting) {
    return <Connecting />;
  }

  return <Party hostPlayerName={playerName} />;
};

const Party = ({ hostPlayerName }: { hostPlayerName: string }) => {
  return <Container>{hostPlayerName}</Container>;
};
