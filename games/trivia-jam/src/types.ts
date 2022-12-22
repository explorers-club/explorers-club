import { IQuestionSetFields } from '@explorers-club/contentful-types';
import {
  Schema,
  SetSchema,
  ArraySchema,
  MapSchema,
  CollectionSchema,
} from '@colyseus/schema';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { TriviaJamCommand } from '@explorers-club/commands';

type Unarray<T> = T extends Array<infer U> ? U : T;

export type IQuestion = Unarray<IQuestionSetFields['questions']>;
export type IQuestionFields = IQuestion['fields'];
export type IQuestionType = IQuestion['sys']['contentType']['sys']['id'];

export type IAnswer =
  | { type: 'multipleChoice'; selectedAnswer: string }
  | { type: 'multipleAnswer'; selectedAnswers: string[] };

// From a prop in colyseus schema, return the serialized
// version of it so that we can call toJSON() and type it.
// This allows us to ensure immutability when using
// usSyncExternalStore() — everytime there is a game state
// update we just toJSON() on it and let the selector
// logic handle memoization and updates.
type SerializaledProp<T> = T extends SetSchema<infer K>
  ? K extends Schema
    ? SerializedSchema<K>[]
    : K[]
  : T extends ArraySchema<infer K>
  ? K extends Schema
    ? SerializedSchema<K>[]
    : K[]
  : T extends CollectionSchema<infer K>
  ? K extends Schema
    ? SerializedSchema<K>[]
    : K[]
  : T extends MapSchema<infer K>
  ? K extends Schema
    ? Record<string, SerializedSchema<K>>
    : Record<string, K>
  : T;

export type SerializedSchema<TSchema> = {
  [K in NonFunctionPropNames<TSchema>]: SerializaledProp<TSchema[K]>;
};

type NonFunctionPropNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type TriviaJamStateSerialized = SerializedSchema<TriviaJamState>;
export type TriviaJamPlayerSerialized = SerializedSchema<TriviaJamPlayer>;

// todo hoist up to lib
type RoomStore<T extends Schema, TCommand> = {
  subscribe: (cb: () => void) => () => void;
  getSnapshot: () => SerializedSchema<T>;
  send: (command: TCommand) => void;
};

export type TriviaJamStore = RoomStore<TriviaJamState, TriviaJamCommand>;
