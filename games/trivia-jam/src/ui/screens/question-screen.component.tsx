import { Box } from '@atoms/Box';
import { FC } from 'react';
import { useIsHost } from '../../state/trivia-jam.hooks';
import { IQuestion } from '../../types';
import { MultipleAnswerHostPreview } from '../components/host-previews/multiple-answer-host-preview.container';
import { MultipleChoiceHostPreview } from '../components/host-previews/multiple-choice-host-preview.container';
import { NumberInputHostPreview } from '../components/host-previews/number-input-host-preview.container';
import { TextInputHostPreview } from '../components/host-previews/text-input-host-preview.container';
import { TrueOrFalseHostPreview } from '../components/host-previews/true-or-false-host-preview.container';
import { MultipleAnswerQuestion } from '../components/questions/multiple-answer-question/multiple-answer-question.container';
import { MultipleChoiceQuestion } from '../components/questions/multiple-choice-question/multiple-choice-question.container';
import { NumberInputQuestion } from '../components/questions/number-input-question/number-input-question.container';
import { TextInputQuestion } from '../components/questions/text-input-question/text-input-question.container';
import { TrueOrFalseQuestion } from '../components/questions/true-or-false-question/true-or-false-question.container';

interface Props {
  question: IQuestion;
}

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

export const QuestionScreenComponent: FC<Props> = ({ question }) => {
  const isHost = useIsHost();

  const contentTypeId = question.sys.contentType.sys.id;
  const QuestionScreen = contentTypeToQuestionComponent[contentTypeId];
  const HostPreviewScreen = contentTypeToHostPreviewComponent[contentTypeId];

  return (
    <Box css={{ p: '$3' }}>
      {isHost ? (
        <HostPreviewScreen question={question} />
      ) : (
        <QuestionScreen question={question} />
      )}
    </Box>
  );
};
