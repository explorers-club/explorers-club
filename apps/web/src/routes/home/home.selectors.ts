import { createSelector } from 'reselect';
import { selectNavigationChildren } from '../../state/navigation.selectors';
import { HomeActor } from './home.machine';

export const selectHomeActor = createSelector(
  selectNavigationChildren,
  (children) => children['homeRouteMachine'] as HomeActor
);