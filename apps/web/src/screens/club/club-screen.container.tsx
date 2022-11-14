import { useSelector } from '@xstate/react';
import { Claimable } from './claimable.component';
import { useClubScreenActor } from './club-screen.hooks';
import { selectIsClaimable } from './club-screen.selectors';
import { GameSelect } from './game-select';
import { PlayerList } from './player-list';
import { Flex } from '@atoms/Flex';

export const ClubScreen = () => {
  const clubScreenActor = useClubScreenActor();

  const isClaimable = useSelector(clubScreenActor, selectIsClaimable);

  if (isClaimable) {
    return <Claimable />;
  }

  return (
    <Flex css={{ fd: 'column', gap: '$3' }}>
      <GameSelect />
      <PlayerList />
    </Flex>
  );
};
