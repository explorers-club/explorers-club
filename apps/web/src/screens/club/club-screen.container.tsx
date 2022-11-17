import { useSelector } from '@xstate/react';
import { memo } from 'react';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor } from './club-screen.hooks';
import { GameScreen } from './game';
import { LobbyScreen } from './lobby';

const selectIsInLobby = () => true;
const selectIsPlaying = () => false;

export const ClubScreen = memo(() => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);
  const inLobby = useSelector(clubScreenActor, selectIsInLobby);
  const isPlaying = useSelector(clubScreenActor, selectIsPlaying);

  switch (true) {
    case inLobby: {
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
