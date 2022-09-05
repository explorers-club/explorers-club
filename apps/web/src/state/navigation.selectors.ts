import { createSelector } from 'reselect';
import { selectAppContext } from './app.selectors';

const selectNavigationActor = createSelector(
  selectAppContext,
  (context) => context.navigationActor
);

export const selectNavigationChildren = createSelector(
  selectNavigationActor,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (actor) => actor.getSnapshot()!.children
);
