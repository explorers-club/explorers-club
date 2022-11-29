import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import type { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { Box } from '@atoms/Box';

export const MultipleChoiceQuestion: FC<IMultipleChoiceFields> = ({
  question,
  correctAnswer,
  incorrectAnswers,
}) => {
  const answers = [correctAnswer, ...incorrectAnswers];
  return (
    <Flex direction="column">
      <Heading size="4">{question}</Heading>
      <Flex direction="column">
        {[answers.map((answer, index) => <Box key={index}>{answer}</Box>)]}
      </Flex>
    </Flex>
  );
};
