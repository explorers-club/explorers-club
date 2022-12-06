import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { useCallback, useMemo } from 'react';
import { MultipleAnswerQuestionComponent } from '../../components/questions/multiple-answer-question';
import { useMyActor } from '../../state/game.hooks';
import { TriviaJamPlayerEvents } from '../../state/trivia-jam-player.machine';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const MultipleAnswerQuestion = () => {
  const actor = useMyActor();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const { prompt, correctAnswers, incorrectAnswers } =
    unwrapFields<IMultipleAnswerFields>(currentQuestion, 'multipleAnswer');

  // todo shuffle these
  const answers = useMemo(
    () => [...(correctAnswers || []), ...(incorrectAnswers || [])],
    [correctAnswers, incorrectAnswers]
  );

  const handleSubmit = useCallback(
    (selectedAnswers: string[]) => {
      actor?.send(
        TriviaJamPlayerEvents.SUBMIT_RESPONSE({
          type: 'multipleAnswer',
          selectedAnswers,
        })
      );
    },
    [actor]
  );

  return (
    <MultipleAnswerQuestionComponent
      prompt={prompt}
      answers={answers}
      onSubmitResponse={handleSubmit}
    />
  );
};
