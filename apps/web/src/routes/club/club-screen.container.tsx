import { useSelector } from '@xstate/react';
import { useClubScreenActor } from './club-screen.hooks';
import { Container } from './club.styles';
import { Loading } from './loading.component';
import { Unclaimed } from './unclaimed.container';

export const ClubScreen = () => {
  const clubScreenActor = useClubScreenActor();
  //   const { authActor } = useContext(GlobalStateContext);

  const playerName = useSelector(
    clubScreenActor,
    (state) => state.context.hostPlayerName
  );

  const isLoading = useSelector(clubScreenActor, (state) =>
    state.matches('Loading')
  );

  const isUnclaimed = useSelector(clubScreenActor, (state) =>
    state.matches('Unclaimed')
  );

  if (!playerName) {
    return <Container>error parsing URL</Container>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isUnclaimed) {
    return <Unclaimed />;
  }

  return <Party hostPlayerName={playerName} />;
};

const Party = ({ hostPlayerName }: { hostPlayerName: string }) => {
  return <Container>{hostPlayerName}</Container>;
};
