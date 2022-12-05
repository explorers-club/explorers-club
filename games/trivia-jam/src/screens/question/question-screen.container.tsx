import { Flex } from '@atoms/Flex';
import { useActorLogger } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { useTriviaJamSharedActor } from '../../state/game.hooks';
import { QuestionScreenComponent } from './question-screen.component';

export const QuestionScreen = () => {
  const actor = useTriviaJamSharedActor();
  const questions = useSelector(actor, (state) => state.context.questions);
  const currentQuestionIndex = useSelector(
    actor,
    (state) => state.context.currentQuestionIndex
  );

  const currentQuestion = questions[currentQuestionIndex];
  console.log(currentQuestion);
  // useActorLogger(actor);
  return <Flex>Question Screen</Flex>;
  // return <QuestionScreenComponent actor={actor} />;
};
