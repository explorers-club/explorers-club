import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import type { ITrueOrFalseFields } from '@explorers-club/contentful-types';

export const TrueFalseQuestion: FC<ITrueOrFalseFields> = ({ question }) => {
  return (
    <Flex>
      <Heading size="4">{question}</Heading>
    </Flex>
  );
};
