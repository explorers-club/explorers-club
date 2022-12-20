import { CONTINUE } from '@explorers-club/commands';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { useTriviaJamRoom } from '../../../state/trivia-jam.hooks';
import { IQuestion } from '../../../types';
import { unwrapFields } from '../../../utils';
import { TrueOrFalseHostPreviewComponent } from './true-or-false-host-preview.component';

interface Props {
  question: IQuestion;
}

export const TrueOrFalseHostPreview: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();

  const { prompt } = unwrapFields<IMultipleAnswerFields>(
    question,
    'trueOrFalse'
  );

  const handleContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return (
    <TrueOrFalseHostPreviewComponent
      onContinue={handleContinue}
      prompt={prompt}
    />
  );
};
