import { createSelector } from 'reselect';
import { selectAppContext } from './app.selectors';

export const selectPartyConnectionActor = createSelector(
  selectAppContext,
  (context) => context.partyConnectionActor
);
