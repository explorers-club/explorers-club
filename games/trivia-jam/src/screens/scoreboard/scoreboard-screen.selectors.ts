import { ScoreboardScreenState } from './scoreboard-screen.machine';

export const selectScoresByUserId = (state: ScoreboardScreenState) =>
  state.context.scoresByUserId;
