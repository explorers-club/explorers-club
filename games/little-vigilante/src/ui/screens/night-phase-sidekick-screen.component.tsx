import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  vigilante: string;
}

export const NightPhaseSidekickScreenComponent: FC<Props> = ({ vigilante }) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>
            Sidekick
          </Caption>
          <Text>
            <strong>{vigilante}</strong> is the <strong>Vigilante</strong>.
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};
