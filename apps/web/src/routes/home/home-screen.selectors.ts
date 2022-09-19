import { createSelector } from 'reselect';
import { selectNavigationChildren } from '../../state/navigation.selectors';
import { HomeScreenActor } from './home-screen.machine';

export const selectHomeScreenActor = createSelector(
  selectNavigationChildren,
  (children) => children['homeScreenMachine'] as HomeScreenActor
);
