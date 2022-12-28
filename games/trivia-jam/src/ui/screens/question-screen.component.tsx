import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { useEntryQuery } from '../../queries/useEntryQuery';
import { useIsHost, useTriviaJamStoreSelector } from '../../state/trivia-jam.hooks';
import { IQuestionType } from '../../types';
import { MultipleAnswerHostPreview } from '../components/host-previews/multiple-answer-host-preview.container';
import { MultipleChoiceHostPreview } from '../components/host-previews/multiple-choice-host-preview.container';
import { NumberInputHostPreview } from '../components/host-previews/number-input-host-preview.container';
import { TextInputHostPreview } from '../components/host-previews/text-input-host-preview.container';
import { TrueOrFalseHostPreview } from '../components/host-previews/true-or-false-host-preview.container';
import { MultipleAnswerQuestion } from '../components/questions/multiple-answer-question.container';
import { MultipleChoiceQuestion } from '../components/questions/multiple-choice-question.container';
import { NumberInputQuestion } from '../components/questions/number-input-question.container';
import { TextInputQuestion } from '../components/questions/text-input-question.container';
import { TrueOrFalseQuestion } from '../components/questions/true-or-false-question.container';

const contentTypeToHostPreviewComponent = {
  multipleAnswer: MultipleAnswerHostPreview,
  multipleChoice: MultipleChoiceHostPreview,
  numberInput: NumberInputHostPreview,
  textInput: TextInputHostPreview,
  trueOrFalse: TrueOrFalseHostPreview,
};

const contentTypeToQuestionComponent = {
  multipleAnswer: MultipleAnswerQuestion,
  multipleChoice: MultipleChoiceQuestion,
  numberInput: NumberInputQuestion,
  textInput: TextInputQuestion,
  trueOrFalse: TrueOrFalseQuestion,
};

interface Props {
  isHost: boolean;
  contentType: IQuestionType;
}

export const QuestionScreenComponent: FC<Props> = ({ isHost, contentType }) => {
  const PlayerQuestionComponent = contentTypeToQuestionComponent[contentType];
  const HostQuestionComponent = contentTypeToHostPreviewComponent[contentType];

  return (
    <Box css={{ p: '$3' }}>
      <Card>
        {isHost ? <HostQuestionComponent /> : <PlayerQuestionComponent />}
      </Card>
    </Box>
  );
};
