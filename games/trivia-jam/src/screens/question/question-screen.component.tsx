import { FC } from 'react';
import { IQuestion } from '../../state/trivia-jam-shared.machine';
import { MultipleAnswerQuestion } from './multiple-answer-question.container';
import { MultipleChoiceQuestion } from './multiple-choice-question.container';
import { TrueOrFalseQuestion } from './true-or-false-question.container';
import { NumberInputQuestion } from './number-input-question.container';
import { TextInputQuestion } from './text-input-question.container';

interface Props {
  question: IQuestion;
}

const contentTypeIdToComponentMap = {
  multipleChoice: MultipleChoiceQuestion,
  multipleAnswer: MultipleAnswerQuestion,
  trueOrFalse: TrueOrFalseQuestion,
  numberInput: NumberInputQuestion,
  textInput: TextInputQuestion,
};

export const QuestionScreenComponent: FC<Props> = ({ question }) => {
  const contentTypeId = question.sys.contentType.sys.id;
  const Component = contentTypeIdToComponentMap[contentTypeId];
  return <Component />;
};
