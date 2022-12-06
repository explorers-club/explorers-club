import { ITextInputFields } from '@explorers-club/contentful-types';
import { TextInputQuestionComponent } from '../../components/questions/text-input-question';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const TextInputQuestion = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const { prompt } = unwrapFields<ITextInputFields>(
    currentQuestion,
    'textInput'
  );

  return <TextInputQuestionComponent prompt={prompt} />;
};
