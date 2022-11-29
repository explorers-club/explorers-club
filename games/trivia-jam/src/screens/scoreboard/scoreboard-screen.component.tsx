import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ScoreboardScreenComponent: FC<Props> = ({ children }) => {
  return (
    <Box css={{ p: '$4' }}>
      <Flex justify="between">
        <Caption>Player</Caption>
        <Caption>Points</Caption>
      </Flex>
      <Flex direction="column">{children}</Flex>
    </Box>
  );
};
