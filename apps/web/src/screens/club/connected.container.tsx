import { Flex } from '@atoms/Flex';
import { GameSelect } from './game-select';
import { PlayerList } from './player-list';

export const Connected = () => {
  return (
    <Flex css={{ fd: 'column', gap: '$3' }}>
      <GameSelect />
      <PlayerList />
    </Flex>
  );
};
