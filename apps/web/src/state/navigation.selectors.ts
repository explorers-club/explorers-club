import { createSelector } from 'reselect';
import { selectAppContext } from './app.selectors';

const selectNavigationActor = createSelector(
  selectAppContext,
  (context) => context.navigationActor
);
