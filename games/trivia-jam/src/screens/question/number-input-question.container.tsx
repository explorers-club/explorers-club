import { INumberInputFields } from '@explorers-club/contentful-types';
import { NumberInputQuestionComponent } from '../../components/questions/number-input-question';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const NumberInputQuestion = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const { prompt } = unwrapFields<INumberInputFields>(
    currentQuestion,
    'numberInput'
  );

  return <NumberInputQuestionComponent prompt={prompt} />;
};
