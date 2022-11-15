import { Flex } from '@atoms/Flex';
import { GameSelect } from '../components/game-select';
import { PlayerList } from '../components/player-list';

export const ConnectedScreen = () => {
  return (
    <Flex css={{ fd: 'column', gap: '$3' }}>
      <GameSelect />
      <PlayerList />
    </Flex>
  );
};
