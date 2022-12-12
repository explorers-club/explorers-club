import { DiffusionarySharedState } from './diffusionary-shared.machine';

export const selectCurrentPlayer = (state: DiffusionarySharedState) =>
  state.context.currentPlayer;

export const selectCurrentImageUrl = (state: DiffusionarySharedState) =>
  state.context.currentImageUrl;
