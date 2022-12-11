import { DiffusionarySharedState } from './diffusionary-shared.machine';

export const selectCurrentPlayer = (state: DiffusionarySharedState) =>
  state.context.currentPlayer;
