// todo beter way todo types here?
// want these constants for use on server
export const CLUB_ROOM_ENTER_NAME = 'ENTER_NAME';
export const CLUB_ROOM_SELECT_GAME = 'SELECT_GAME';
export const CLUB_ROOM_START_GAME = 'START_GAME';

export type ClubRoomEnterNameCommand = {
  type: 'ENTER_NAME';
  playerName: string;
};
export type ClubRoomSelectGameCommand = {
  type: 'SELECT_GAME';
  gameId: 'diffusionary' | 'trivia_jam';
};
export type ClubRoomStartGameCommand = {
  type: 'START_GAME';
};

export type ClubRoomCommand =
  | ClubRoomEnterNameCommand
  | ClubRoomSelectGameCommand
  | ClubRoomStartGameCommand;
