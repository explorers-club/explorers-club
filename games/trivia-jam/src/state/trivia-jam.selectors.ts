import { createSelector } from 'reselect';
import { TriviaJamState } from './trivia-jam.machine';

const selectTriviaJamContext = (state: TriviaJamState) => state.context;

export const selectConnectedPlayers = createSelector(
  selectTriviaJamContext,
  (context) => context.playerActorIds
);
