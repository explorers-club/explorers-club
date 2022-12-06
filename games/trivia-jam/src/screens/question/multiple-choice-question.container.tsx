import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { useCallback, useMemo } from 'react';
import { MultipleChoiceQuestionComponent } from '../../components/questions/multiple-choice-question';
import { useMyActor } from '../../state/game.hooks';
import { TriviaJamPlayerEvents } from '../../state/trivia-jam-player.machine';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const MultipleChoiceQuestion = () => {
  const actor = useMyActor();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const handleSubmit = useCallback(
    (selectedAnswer: string) => {
      console.log('SENDING', selectedAnswer);
      actor?.send(
        TriviaJamPlayerEvents.SUBMIT_RESPONSE({
          type: 'multipleChoice',
          selectedAnswer,
        })
      );
    },
    [actor]
  );

  const { prompt, correctAnswer, incorrectAnswers } =
    unwrapFields<IMultipleChoiceFields>(currentQuestion, 'multipleChoice');

  // todo shuffle these
  const answers = useMemo(
    () => [correctAnswer, ...(incorrectAnswers || [])],
    [correctAnswer, incorrectAnswers]
  );

  return (
    <MultipleChoiceQuestionComponent
      prompt={prompt}
      answers={answers}
      onSubmitResponse={handleSubmit}
    />
  );
};
