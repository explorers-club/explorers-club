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
      throw new Error('Unrecognized club screen state');
    }
  }

  // const clubScreenActor = useClubScreenActor();
  // useActorLogger(clubScreenActor);

  // const isClaimable = useSelector(clubScreenActor, selectIsClaimable);
  // const isEnteringName = useSelector(clubScreenActor, (state) => {
  //   return state.matches('Connected.EnteringName');
  // });

  // switch (true) {
  //   case isClaimable: {
  //     return <ClaimableScreen />;
  //   }
  //   case isEnteringName: {
  //     return <EnterNameScreen />;
  //   }
  //   default: {
  //     // TODO this default is wrong, need disconnected, joining, etc states
  //     return <ConnectedScreen />;
  //   }
  // }
});
