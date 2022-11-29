import { createSelector } from 'reselect';
import { TriviaJamSharedState } from './trivia-jam-shared.machine';

const selectTriviaJamSharedState = (state: TriviaJamSharedState) => state;

const selectTriviaJamSharedContext = createSelector(
  selectTriviaJamSharedState,
  (state) => state.context
);

export const selectPlayerUserIds = createSelector(
  selectTriviaJamSharedContext,
  (context) => context.playerUserIds
);

export const selectScores = createSelector(
  selectTriviaJamSharedContext,
  (context) => context.scores
);

export const selectIsStaging = (state: TriviaJamSharedState) =>
  state.matches('Staging');

export const selectIsAwaitingQuestion = (state: TriviaJamSharedState) =>
  state.matches('Playing.AwaitingQuestion');

export const selectIsShowingQuestion = (state: TriviaJamSharedState) =>
  state.matches('Playing.Question');
