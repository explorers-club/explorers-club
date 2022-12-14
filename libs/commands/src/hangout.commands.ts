// todo beter way todo types here?
// want these constants for use on server
export const HANGOUT_ROOM_ENTER_NAME = 'ENTER_NAME';
export const HANGOUT_ROOM_SELECT_GAME = 'SELECT_GAME';
export const HANGOUT_ROOM_START_GAME = 'START_GAME';

export type HangoutRoomEnterNameCommand = {
  type: 'ENTER_NAME';
  playerName: string;
};
export type HangoutRoomSelectGameCommand = {
  type: 'SELECT_GAME';
  gameId: 'diffusionary' | 'trivia_jam';
};
export type HangoutRoomStartGameCommand = {
  type: 'START_GAME';
};

export type HangoutRoomCommand =
  | HangoutRoomEnterNameCommand
  | HangoutRoomSelectGameCommand
  | HangoutRoomStartGameCommand;
