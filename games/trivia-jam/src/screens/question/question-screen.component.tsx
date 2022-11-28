import { Flex } from '@atoms/Flex';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { QuestionPrompt } from '../../components/question-prompt';
import { QuestionScreenActor } from './question-screen.machine';
import { useActorLogger } from "@explorers-club/actor";

interface Props {
  actor: QuestionScreenActor;
}

export const QuestionScreenComponent: FC<Props> = ({ actor }) => {
  useActorLogger(actor);
  const data = useSelector(actor, (state) => state.context.data);
  if (!data) {
    return <Flex>Loading</Flex>;
  }

  return (
    <Flex>
      <QuestionPrompt
        eyebrow={'Round 1'}
        question={data.question}
        inputLabel={'Enter your guess'}
      />
    </Flex>
  );
};
