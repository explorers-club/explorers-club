import React from 'react';
import { Flex } from '@atoms/Flex';
import { Caption } from '@atoms/Caption';
import { Heading } from '@atoms/Heading';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';

export const MultipleChoiceReviewComponent = ({
  fields,
}: {
  fields: IMultipleChoiceFields;
}) => {
  return (
    <Flex direction="column">
      <Caption>Correct answer</Caption>
      <Heading>{fields.correctAnswer}</Heading>
    </Flex>
  );
};
