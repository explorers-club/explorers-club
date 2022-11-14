import { useSelector } from '@xstate/react';
import { Claimable } from './claimable.component';
import { useClubScreenActor } from './club-screen.hooks';
import { selectIsClaimable } from './club-screen.selectors';
import { GameSelect } from './game-select';
import { PlayerList } from './player-list';
import { Flex } from '@atoms/Flex';
import { EnterName } from './enter-name';
import { memo } from 'react';

export const ClubScreen = memo(() => {
  const clubScreenActor = useClubScreenActor();

  const isClaimable = useSelector(clubScreenActor, selectIsClaimable);
  const isEnteringName = useSelector(clubScreenActor, (state) => {
    return state.matches('Connected.EnteringName');
  });

  if (isClaimable) {
    return <Claimable />;
  }

  if (isEnteringName) {
    return <EnterName />;
  }

  return (
    <Flex css={{ fd: 'column', gap: '$3' }}>
      <GameSelect />
      <PlayerList />
    </Flex>
  );
});
