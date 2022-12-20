import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/commands';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { TextInputQuestionComponent } from '../components/questions/text-input-question';
import { useTriviaJamRoom } from '../state/trivia-jam.hooks';
import { IQuestion } from '../types';
import { unwrapFields } from '../utils';

interface Props {
  question: IQuestion;
}
export const TextInputQuestion: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();
  const { prompt } = unwrapFields<ITextInputFields>(question, 'textInput');

  const handleSubmit = useCallback(
    (response: string) => {
      room.send(TRIVIA_JAM_SUBMIT_RESPONSE, { response });
    },
    [room]
  );

  return (
    <TextInputQuestionComponent
      prompt={prompt}
      onSubmitResponse={handleSubmit}
    />
  );
};
