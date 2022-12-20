import { CONTINUE } from '@explorers-club/commands';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { useTriviaJamRoom } from '../../../state/trivia-jam.hooks';
import { IQuestion } from '../../../types';
import { unwrapFields } from '../../../utils';
import { MultipleAnswerHostPreviewComponent } from './multiple-answer-host-preview.component';

interface Props {
  question: IQuestion;
}

export const MultipleAnswerHostPreview: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();

  const { prompt } = unwrapFields<IMultipleAnswerFields>(
    question,
    'multipleAnswer'
  );

  const handleContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return (
    <MultipleAnswerHostPreviewComponent
      onContinue={handleContinue}
      prompt={prompt}
    />
  );
};
