import { createSelector } from 'reselect';
import { TriviaJamState } from './trivia-jam.machine';

const selectTriviaJamState = (state: TriviaJamState) => state;

const selectTriviaJamContext = (state: TriviaJamState) => state.context;

export const selectConnectedPlayers = createSelector(
  selectTriviaJamContext,
  (context) => context.playerActorIds
);

export const selectIsLoading = createSelector(selectTriviaJamState, (state) =>
  state.matches('Loading')
);

export const selectIsAwaitingQuestion = createSelector(
  selectTriviaJamState,
  (state) => state.matches('Playing.AwaitingQuestion')
);

export const selectIsAwaitingResponse = createSelector(
  selectTriviaJamState,
  (state) => state.matches('Playing.AwaitingResponse')
);

export const selectIsAwaitingJudgement = createSelector(
  selectTriviaJamState,
  (state) => state.matches('Playing.AwaitingJudgement')
);

export const selectIsGameOver = createSelector(selectTriviaJamState, (state) =>
  state.matches('GameOver')
);
