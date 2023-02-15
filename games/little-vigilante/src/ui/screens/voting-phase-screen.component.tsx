import { Flex } from '@atoms/Flex';
import { Card } from '@atoms/Card';
import { Chat } from '../organisms/chat.component';
import { VoteGrid } from '../organisms/vote-grid/vote-grid.container';

export const VotingPhaseScreenComponent = () => {
  return (
    <Flex direction="column" gap="1" css={{ minHeight: '100%' }}>
      <Card css={{ p: '$3' }}>
        <VoteGrid />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat />
      </Card>
    </Flex>
  );
};
