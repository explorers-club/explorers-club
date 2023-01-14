import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  timeRemaining: number;
}

export const DiscussionPhaseScreenComponent: FC<Props> = ({
  timeRemaining,
}) => {
  return (
    <Flex css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Discussion</Caption>
          <Text>{timeRemaining} seconds remaining</Text>;
        </Flex>
      </Card>
    </Flex>
  );
};
