import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import type { IMultipleAnswerQuestionFields } from '@explorers-club/contentful-types';

export const MultipleAnswerQuestion: FC<IMultipleAnswerQuestionFields> = ({
  question,
}) => {

  return (
    <Flex>
      <Heading size="4">{question}</Heading>
    </Flex>
  );
};
