import {
  ArraySchema,
  CollectionSchema,
  MapSchema,
  Schema,
  SetSchema,
} from '@colyseus/schema';
import {
  CodebreakersConfig,
  DiffusionaryConfig,
  LittleVigilanteConfig,
  TriviaJamConfig,
} from '@explorers-club/schema';
import { ClubPlayer } from '@explorers-club/schema-types/ClubPlayer';
import { ClubState } from '@explorers-club/schema-types/ClubState';
import { CodebreakersPlayer } from '@explorers-club/schema-types/CodebreakersPlayer';
import { CodebreakersState } from '@explorers-club/schema-types/CodebreakersState';
import { DiffusionaryPlayer } from '@explorers-club/schema-types/DiffusionaryPlayer';
import { DiffusionaryState } from '@explorers-club/schema-types/DiffusionaryState';
import { LittleVigilantePlayer } from '@explorers-club/schema-types/LittleVigilantePlayer';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';

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
export const TYPING = 'TYPING';
export const MESSAGE = 'MESSAGE';
export const DISCONNECT = 'DISCONNECT';
export const PRESS_DOWN = 'PRESS_DOWN';
export const PRESS_UP = 'PRESS_UP';
export const LEAVE = 'LEAVE';
export const CONTINUE = 'CONTINUE';
export const RECONNECT = 'RECONNECT';

export type LeaveCommand = {
  type: typeof LEAVE;
  userId: string;
};

export type JoinCommand = {
  type: typeof JOIN;
  userId: string;
};

export type PauseCommand = {
  type: 'PAUSE';
};

export type ResumeCommand = {
  type: 'RESUME';
};

export type PressDownCommand = {
  type: typeof PRESS_DOWN;
};

export type PressUpCommand = {
  type: typeof PRESS_UP;
};

// export type LogAbilityCommand = {
//   type: 'LOG_ABILITY';
//   text: string;
//   abilityGroup: AbilityGroup;
//   role: Role;
// };

export type TypingCommand = {
  type: typeof TYPING;
};

export type MessageCommand = {
  type: typeof MESSAGE;
  text: string;
};

export type LittleVigilanteLogCommand =
  | {
      type: 'LOG';
      key: 'starting_role';
      parameters: {
        role: string;
      };
    }
  | {
      type: 'LOG';
      key: 'arrested';
    }
  | {
      type: 'LOG';
      key: 'vote_called';
      parameters: {
        calledByUserId: string;
      };
    };

export type ContinueCommand = {
  type: typeof CONTINUE;
};

export type ReconnectCommand = {
  type: typeof RECONNECT;
  userId: string;
};

export type DisconnectCommand = {
  type: typeof DISCONNECT;
  userId: string;
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
export type TriviaJamPlayerSerialized = SerializedSchema<TriviaJamPlayer>;

export type DiffusionaryCommand = JoinCommand;
export type DiffusionaryStore = RoomStore<
  DiffusionaryState,
  DiffusionaryCommand
>;
export type DiffusionaryPlayerSerialized = SerializedSchema<DiffusionaryPlayer>;

export type CodebreakersClueCommand = {
  type: 'CLUE';
  clue: string;
  numWords: number;
};

export type CodebreakersGuessCommand = {
  type: 'GUESS';
  word: string;
};

export type CodebreakersHighlightCommand = {
  type: 'HIGHLIGHT';
  word: string;
};

export type CodebreakersJoinTeamCommand = {
  type: 'JOIN_TEAM';
  team: string;
};

export type CodebreakersBecomeClueGiverCommand = {
  type: 'BECOME_CLUE_GIVER';
};

export type CodebreakersCommand =
  | JoinCommand
  | ContinueCommand
  | LeaveCommand
  | CodebreakersClueCommand
  | CodebreakersHighlightCommand
  | CodebreakersJoinTeamCommand
  | CodebreakersBecomeClueGiverCommand
  | CodebreakersGuessCommand;

export type CodebreakersStore = RoomStore<
  CodebreakersState,
  CodebreakersCommand
>;
export type CodebreakersStateSerialized = SerializedSchema<CodebreakersState>;
export type CodebreakersPlayerSerialized = SerializedSchema<CodebreakersPlayer>;

export type LittleVigilanteCallVoteCommand = {
  type: 'CALL_VOTE';
};
export type LittleVigilanteApproveVoteCommand = {
  type: 'APPROVE_VOTE';
};
export type LittleVigilanteRejectVoteCommand = {
  type: 'REJECT_VOTE';
};
export type LittleVigilanteTargetPlayerRoleCommand = {
  type: 'TARGET_ROLE';
  role: string;
  targetedUserId: string;
};
export type LittleVigilanteVoteCommand = {
  type: 'VOTE';
  votedUserId: string;
};
export type LittleVigilanteArrestCommand = {
  type: 'ARREST';
  arrestedUserId: string;
};
export type LittleVigilanteSwapCommand = {
  type: 'SWAP';
  firstUserId: string;
  secondUserId: string;
};

export type LittleVigilanteCommand =
  | JoinCommand
  | ContinueCommand
  | LeaveCommand
  | DisconnectCommand
  | ReconnectCommand
  | MessageCommand
  | TypingCommand
  | PressDownCommand
  | PauseCommand
  | ResumeCommand
  | PressUpCommand
  | LittleVigilanteLogCommand
  | LittleVigilanteRejectVoteCommand
  | LittleVigilanteApproveVoteCommand
  | LittleVigilanteCallVoteCommand
  | LittleVigilanteTargetPlayerRoleCommand
  | LittleVigilanteVoteCommand
  | LittleVigilanteArrestCommand
  | LittleVigilanteSwapCommand;

export type LittleVigilanteCommandType = LittleVigilanteCommand['type'];

export type LittleVigilanteStore = RoomStore<
  LittleVigilanteState,
  LittleVigilanteCommand
>;
export type LittleVigilanteStateSerialized =
  SerializedSchema<LittleVigilanteState>;
export type LittleVigilantePlayerSerialized =
  SerializedSchema<LittleVigilantePlayer>;

// Aggregate
export type GameStore =
  | TriviaJamStore
  | DiffusionaryStore
  | LittleVigilanteStore;

export type GameConfig =
  | TriviaJamConfig
  | DiffusionaryConfig
  | LittleVigilanteConfig
  | CodebreakersConfig;

// Club Room
export const CLUB_ROOM_ENTER_NAME = 'ENTER_NAME';
export const CLUB_ROOM_SELECT_GAME = 'SELECT_GAME';
export const CLUB_ROOM_SET_GAME_CONFIG = 'SET_GAME_CONFIG';
export const CLUB_ROOM_START_GAME = 'START_GAME';

export type GameId =
  | 'diffusionary'
  | 'trivia_jam'
  | 'little_vigilante'
  | 'codebreakers';

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
  | JoinCommand
  | DisconnectCommand
  | ReconnectCommand
  | LeaveCommand
  | ClubRoomEnterNameCommand
  | ClubRoomSelectGameCommand
  | ClubRoomSetGameConfigCommand
  | ClubRoomStartGameCommand;

interface ServerEventProps {
  userId: string;
  ts: number;
}

export type ServerEvent<T> = T & ServerEventProps;

export type ChatServerEvent = ServerEvent<MessageCommand | TypingCommand>;

export type LittleVigilanteServerEvent = ServerEvent<LittleVigilanteCommand>;

// tood use zod schema for events, use to write type guards for rxjs
// https://dev.to/sachitsac/typescript-type-guards-with-zod-1m12
export function isChatEvent(obj: any): obj is ChatServerEvent {
  if (obj && obj.type === 'MESSAGE') {
    return true;
  }
  return false;
}

export function isLittleVigilanteEvent(
  obj: any
): obj is ServerEvent<LittleVigilanteCommand> {
  // its okay to not actually filter this, it just means xstate
  // is processing more events that it needs to. in future use zod.safeParse here
  return true;
}

export type ClubRoomServerEvent =
  | (ClubRoomCommand & ServerEventProps)
  | ChatServerEvent;

export type GameCommand =
  | LittleVigilanteCommand
  | CodebreakersCommand
  | DiffusionaryCommand
  | TriviaJamCommand;
export type GameServerEvent = GameCommand & ServerEventProps;

export type RoomServerEvent = ClubRoomServerEvent | GameServerEvent;

export type ClubRoomCommandType = ClubRoomCommand['type'];

export type ClubStore = RoomStore<ClubState, ClubRoomCommand>;
export type ClubStateSerialized = SerializedSchema<ClubState>;
export type ClubPlayerSerialized = SerializedSchema<ClubPlayer>;
