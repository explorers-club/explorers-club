import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/commands';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { NumberInputQuestionComponent } from '../components/questions/number-input-question';
import { useTriviaJamRoom } from '../state/trivia-jam.hooks';
import { IQuestion } from '../types';
import { unwrapFields } from '../utils';

interface Props {
  question: IQuestion;
}
export const NumberInputQuestion: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();
  const { prompt } = unwrapFields<INumberInputFields>(question, 'numberInput');

  const handleSubmit = useCallback(
    (response: number) => {
      room.send(TRIVIA_JAM_SUBMIT_RESPONSE, { response });
    },
    [room]
  );

  return (
    <NumberInputQuestionComponent
      prompt={prompt}
      onSubmitResponse={handleSubmit}
    />
  );
};
