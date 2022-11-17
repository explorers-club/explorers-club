import { useSelector } from '@xstate/react';
import { memo } from 'react';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor } from './club-screen.hooks';
import { selectIsUnclaimed, selectIsInLobby, selectIsPlaying } from './club-screen.selectors';
import { GameScreen } from './game';
import { LobbyScreen } from './lobby';
import { UnclaimedScreen } from './unclaimed';

export const ClubScreen = memo(() => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);
  const isUnclaimed = useSelector(clubScreenActor, selectIsUnclaimed);
  const isInLobby = useSelector(clubScreenActor, selectIsInLobby);
  const isPlaying = useSelector(clubScreenActor, selectIsPlaying);

  switch (true) {
    case isUnclaimed: {
      return <UnclaimedScreen />;
    }
    case isInLobby: {
      return <LobbyScreen />;
    }
    case isPlaying: {
      return <GameScreen />;
    }
    default: {
      return null;
    }
  }
});
