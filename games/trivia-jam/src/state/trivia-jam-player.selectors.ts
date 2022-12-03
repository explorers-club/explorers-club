import { TriviaJamPlayerState } from './trivia-jam-player.machine';

export const selectPlayerName = (state: TriviaJamPlayerState) =>
  state.context.playerName;

export const selectPlayerIsReady = (state: TriviaJamPlayerState) =>
  state.matches('Ready.Yes');
