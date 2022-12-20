import {
  IMultipleAnswer,
  IMultipleAnswerFields,
  IMultipleChoice,
  IMultipleChoiceFields,
  INumberInput,
  INumberInputFields,
  ITextInput,
  ITextInputFields,
  ITrueOrFalse,
  ITrueOrFalseFields,
} from '@explorers-club/contentful-types';

export type IQuestion =
  | IMultipleChoice
  | IMultipleAnswer
  | INumberInput
  | ITextInput
  | ITrueOrFalse;

export type IQuestionFields =
  | IMultipleChoiceFields
  | IMultipleAnswerFields
  | INumberInputFields
  | ITextInputFields
  | ITrueOrFalseFields;

export type IAnswer =
  | { type: 'multipleChoice'; selectedAnswer: string }
  | { type: 'multipleAnswer'; selectedAnswers: string[] };
