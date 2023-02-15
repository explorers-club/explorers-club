import { Card } from '@atoms/Card';
import { Chat } from '../organisms/chat.component';
import { RoleReveal } from '../molecules/role-reveal';
import { Flex } from '@atoms/Flex';

export const RevealScreenComponent = () => {
  return (
    <Flex
      direction="column"
      gap="1"
      css={{ minHeight: '100%', maxHeight: '100%' }}
    >
      <Card css={{ py: '$3' }}>
        <RoleReveal />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat />
      </Card>
    </Flex>
  );
};
