import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { TrueOrFalseQuestionComponent } from '../../components/questions/true-or-false-question';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const TrueOrFalseQuestion = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const { prompt } = unwrapFields<ITrueOrFalseFields>(
    currentQuestion,
    'trueOrFalse'
  );

  return <TrueOrFalseQuestionComponent prompt={prompt} />;
};
