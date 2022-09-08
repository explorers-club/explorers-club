import { createSelector } from 'reselect';
import { selectAppContext } from './app.selectors';

export const selectPartyActor = createSelector(
  selectAppContext,
  (context) => context.partyActor
);
