import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  role: string;
}

export const NightPhaseMonkScreenComponent: FC<Props> = ({ role }) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Monk</Caption>
          <Text>
            You are the <strong>{role}</strong>.
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};
