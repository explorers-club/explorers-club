import { CONTINUE } from '@explorers-club/commands';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { useTriviaJamRoom } from '../../../state/trivia-jam.hooks';
import { IQuestion } from '../../../types';
import { unwrapFields } from '../../../utils';
import { NumberInputHostPreviewComponent } from './number-input-host-preview.component';

interface Props {
  question: IQuestion;
}

export const NumberInputHostPreview: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();

  const { prompt } = unwrapFields<INumberInputFields>(
    question,
    'multipleAnswer'
  );

  const handleContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return (
    <NumberInputHostPreviewComponent
      onContinue={handleContinue}
      prompt={prompt}
    />
  );
};
