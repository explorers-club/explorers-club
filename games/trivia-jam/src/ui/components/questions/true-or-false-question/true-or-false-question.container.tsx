import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/commands';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { TrueOrFalseQuestionComponent } from '.';
import { useTriviaJamRoom } from '../../../../state/trivia-jam.hooks';
import { IQuestion } from '../../../../types';
import { unwrapFields } from '../../../../utils';

interface Props {
  question: IQuestion;
}

export const TrueOrFalseQuestion: FC<Props> = ({ question }) => {
  const { prompt } = unwrapFields<ITrueOrFalseFields>(question, 'trueOrFalse');
  const room = useTriviaJamRoom();

  const handleSubmit = useCallback(
    (response: boolean) => {
      room.send(TRIVIA_JAM_SUBMIT_RESPONSE, { response });
    },
    [room]
  );

  return (
    <TrueOrFalseQuestionComponent
      prompt={prompt}
      onSubmitResponse={handleSubmit}
    />
  );
};
