import { useSelector } from '@xstate/react';
import { useTriviaJamSharedActor } from '../../state/game.hooks';

export const useCurrentQuestion = () => {
  const actor = useTriviaJamSharedActor();
  const questions = useSelector(actor, (state) => state.context.questions);
  const currentQuestionIndex = useSelector(
    actor,
    (state) => state.context.currentQuestionIndex
  );

  return questions[currentQuestionIndex];
};
