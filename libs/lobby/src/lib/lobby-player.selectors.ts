import { createSelector } from 'reselect';
import { LobbyPlayerState } from './lobby-player.machine';

const selectLobbyPlayerContext = (state: LobbyPlayerState) => state.context;

export const selectLobbyPlayerName = createSelector(
  selectLobbyPlayerContext,
  (context) => context.playerName
);
