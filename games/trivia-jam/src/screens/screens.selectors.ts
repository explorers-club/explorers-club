import { createSelector } from 'reselect';
import { ScreensState } from './screens.machine';

const selectScreensState = (state: ScreensState) => state;

export const selectIsShowingIntroduction = createSelector(
  selectScreensState,
  (state) => state.matches('Introduction')
);
o;
export const selectIsShowingQuestion = createSelector(
  selectScreensState,
  (state) => state.matches('Question')
);

export const selectIsShowingScoreboard = createSelector(
  selectScreensState,
  (state) => state.matches('Scoreboard')
);
