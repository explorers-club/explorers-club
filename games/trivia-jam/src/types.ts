import { TriviaJamCommand } from '@explorers-club/commands';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import { RoomStore, SerializedSchema } from '@explorers-club/room';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';

type Unarray<T> = T extends Array<infer U> ? U : T;

export type IQuestion = Unarray<IQuestionSetFields['questions']>;
export type IQuestionFields = IQuestion['fields'];
export type IQuestionType = IQuestion['sys']['contentType']['sys']['id'];

export type IAnswer =
  | { type: 'multipleChoice'; selectedAnswer: string }
  | { type: 'multipleAnswer'; selectedAnswers: string[] };

export type TriviaJamStateSerialized = SerializedSchema<TriviaJamState>;
export type TriviaJamPlayerSerialized = SerializedSchema<TriviaJamPlayer>;

export type TriviaJamStore = RoomStore<TriviaJamState, TriviaJamCommand>;
