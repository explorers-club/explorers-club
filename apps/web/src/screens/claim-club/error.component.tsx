import { Flex } from '@atoms/Flex';
import { Box } from '@atoms/Box';
import { FC } from 'react';

interface Props {
  message: string;
}
export const Error: FC<Props> = ({ message }) => {
  return (
    <Flex>
      <Box css={{ p: '$3' }}>Error: {message}</Box>;
    </Flex>
  );
};
