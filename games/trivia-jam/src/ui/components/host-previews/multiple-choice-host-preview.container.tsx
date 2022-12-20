import { CONTINUE } from '@explorers-club/commands';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { useTriviaJamRoom } from '../../../state/trivia-jam.hooks';
import { IQuestion } from '../../../types';
import { unwrapFields } from '../../../utils';
import { MultipleChoiceHostPreviewComponent } from './multiple-choice-host-preview.component';

interface Props {
  question: IQuestion;
}

export const MultipleChoiceHostPreview: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();

  const { prompt } = unwrapFields<IMultipleChoiceFields>(
    question,
    'multipleAnswer'
  );

  const handleContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return (
    <MultipleChoiceHostPreviewComponent
      onContinue={handleContinue}
      prompt={prompt}
    />
  );
};
