import { createSelector } from 'reselect';
import { ScreensState } from './screens.machine';

const selectScreensState = (state: ScreensState) => state;

export const selectIsShowingIntroduction = createSelector(
  selectScreensState,
  (state) => state.matches('Introduction')
);
