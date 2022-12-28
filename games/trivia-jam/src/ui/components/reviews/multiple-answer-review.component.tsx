/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { FC } from 'react';

interface Props {
  fields: IMultipleAnswerFields;
}

export const MultipleAnswerReviewComponent: FC<Props> = ({ fields }) => {
  return (
    <Flex direction="column">
      <Heading>Correct Answers</Heading>
      {/* // TODO why are these nullable */}
      {fields.correctAnswers!.map((answer) => (
        <Text key={answer}>{answer}</Text>
      ))}
      <Heading>Incorrect Answers</Heading>
      {fields.incorrectAnswers!.map((answer) => (
        <Text key={answer}>{answer}</Text>
      ))}
    </Flex>
  );
};
