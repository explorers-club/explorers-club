import { createSelector } from 'reselect';
import { selectNavigationChildren } from '../../state/navigation.selectors';

export const selectHomeActor = createSelector(
  selectNavigationChildren,
  (children) => children['homeMachine']
);
