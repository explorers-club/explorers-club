import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';

interface Props {
  prompt: string;
}

export const TextInputQuestionComponent: FC<Props> = ({ prompt }) => {
  return (
    <Flex>
      <Heading size="4">{prompt}</Heading>
    </Flex>
  );
};
