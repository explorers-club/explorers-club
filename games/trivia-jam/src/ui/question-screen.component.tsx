import React from 'react';
import { Flex } from '@atoms/Flex';
import { useCurrentQuestionEntryId } from './trivia-jam-room.hooks';

export const QuestionScreenComponent = () => {
  const entryId = useCurrentQuestionEntryId();
  return <Flex>Generated questionScreen {entryId}i d</Flex>;
};
