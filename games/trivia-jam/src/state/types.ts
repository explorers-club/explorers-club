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

export type GameId = 'TRIVIA_JAM' | 'COCO_COURIERS';

export const GAME_ID: GameId = 'TRIVIA_JAM';

export type ProfileData = {
  userId: string;
  name: string;
};

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
