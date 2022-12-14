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
