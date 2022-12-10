import { createSelector } from 'reselect';
import { DiffusionaryPlayerState } from './diffusionary-player.machine';

export const selectPlayerName = (state: DiffusionaryPlayerState) =>
  state.context.playerName;

export const selectPlayerIsReady = createSelector(
  selectPlayerName,
  (playerName) => !!playerName
);
