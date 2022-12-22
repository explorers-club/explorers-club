import { useEntryQuery } from '../../queries/useEntryQuery';
import { useIsHost, useStoreSelector } from '../../state/trivia-jam.hooks';
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

export const QuestionScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entryId = useStoreSelector((state) => state.currentQuestionEntryId);
  const isHost = useIsHost();
  const query = useEntryQuery(entryId);

  if (!query.data) {
    return null;
  }

  const contentType = query.data.sys.contentType.sys.id as IQuestionType;

  const PlayerQuestionComponent = contentTypeToQuestionComponent[contentType];
  const HostQuestionComponent = contentTypeToHostPreviewComponent[contentType];

  return isHost ? <HostQuestionComponent /> : <PlayerQuestionComponent />;
};
