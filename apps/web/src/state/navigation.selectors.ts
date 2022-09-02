import { context } from '@react-three/fiber';
import { createSelector } from 'reselect';
import { selectAppContext } from './app.selectors';

const selectNavigationActor = createSelector(
  selectAppContext,
  (context) => context.navigationActor
);

const selectNavigationState = createSelector(selectNavigationActor, (actor) => {
  const snap = actor.getSnapshot();
  if (!snap) {
    // TODO better way to handle this?
    throw new Error("Couldn't get actor");
  }
  return snap;
});

const selectNavigationChildren = createSelector(
  selectNavigationState,
  (state) => state.children
);

export const selectHomeActor = createSelector(
  selectNavigationChildren,
  (children) => children['homeMachine']
);
