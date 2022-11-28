import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { QuestionScreenActor } from './question-screen.machine';

interface Props {
  actor: QuestionScreenActor;
}

export const QuestionScreenComponent: FC<Props> = ({ actor }) => {
  console.log([actor]);
  return <Flex>Question Screen</Flex>;
};
