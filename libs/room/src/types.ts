import {
  Schema,
  SetSchema,
  ArraySchema,
  MapSchema,
  CollectionSchema,
} from '@colyseus/schema';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { TriviaJamConfig } from '@explorers-club/schema-types/TriviaJamConfig';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';

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

type AnyFunction = (...args: any[]) => unknown;

type NonFunctionPropNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends AnyFunction | undefined ? never : K;
}[keyof T];

export type RoomStore<T extends Schema, TCommand> = {
  id: string; // todo type this better with RoomId
  subscribe: (cb: (state: SerializedSchema<T>) => void) => () => void;
  getSnapshot: () => SerializedSchema<T>;
  send: (command: TCommand) => void;
};

// Common
export const JOIN = 'JOIN';
export const LEAVE = 'LEAVE';
export const CONTINUE = 'CONTINUE';

export type LeaveCommand = {
  type: typeof LEAVE;
  userId: string;
};

export type JoinCommand = {
  type: typeof JOIN;
  userId: string;
};

export type ContinueCommand = {
  type: typeof CONTINUE;
};

// Trivia Jam
export const TRIVIA_JAM_SUBMIT_RESPONSE = 'TRIVIA_JAM_SUBMIT_RESPONSE';
export type QuestionResponse = string[] | string | number | boolean | undefined;
export type TriviaJamSubmitResponseCommand = {
  type: typeof TRIVIA_JAM_SUBMIT_RESPONSE;
  response: QuestionResponse;
};
export type TriviaJamCommand =
  | ContinueCommand
  | JoinCommand
  | LeaveCommand
  | TriviaJamSubmitResponseCommand;
export type TriviaJamStore = RoomStore<TriviaJamState, TriviaJamCommand>;
export type TriviaJamStateSerialized = SerializedSchema<TriviaJamState>;
export type TriviaJamConfigSerialized = SerializedSchema<TriviaJamConfig>;
export type TriviaJamPlayerSerialized = SerializedSchema<TriviaJamPlayer>;

export type DiffusionaryCommand = ContinueCommand;
export type DiffusionaryStore = RoomStore<
  DiffusionaryState,
  DiffusionaryCommand
>;

export type GameConfig = {
  type: 'trivia_jam';
  data: TriviaJamConfigSerialized;
};

// Club Room
export const CLUB_ROOM_ENTER_NAME = 'ENTER_NAME';
export const CLUB_ROOM_SELECT_GAME = 'SELECT_GAME';
export const CLUB_ROOM_SET_GAME_CONFIG = 'SET_GAME_CONFIG';
export const CLUB_ROOM_START_GAME = 'START_GAME';

export type GameId = 'diffusionary' | 'trivia_jam' | 'little_vigilante';

export type ClubRoomEnterNameCommand = {
  type: typeof CLUB_ROOM_ENTER_NAME;
  playerName: string;
};

export type ClubRoomSelectGameCommand = {
  type: typeof CLUB_ROOM_SELECT_GAME;
  gameId: GameId;
};

export type ClubRoomSetGameConfigCommand = {
  type: typeof CLUB_ROOM_SET_GAME_CONFIG;
  config: GameConfig;
};

export type ClubRoomStartGameCommand = {
  type: typeof CLUB_ROOM_START_GAME;
};

export type ClubRoomCommand =
  | ClubRoomEnterNameCommand
  | ClubRoomSelectGameCommand
  | ClubRoomSetGameConfigCommand
  | ClubRoomStartGameCommand;

export type ClubStore = RoomStore<ClubState, ClubRoomCommand>;
export type ClubStateSerialized = SerializedSchema<ClubState>;
export type ClubPlayerSerialized = SerializedSchema<ClubPlayer>;
