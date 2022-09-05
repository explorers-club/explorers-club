import { createSelector } from 'reselect';
import { selectNavigationChildren } from '../../state/navigation.selectors';
import { HomeActor } from './home.machine';

export const selectHomeActor = createSelector(
  selectNavigationChildren,
  (children) => children['homeMachine'] as HomeActor
);

export const selectHomeValidationError = createSelector(
  selectHomeActor,
  (actor) => {
    console.log('HI!', actor.getSnapshot());
    if (actor.getSnapshot()?.matches('ValidationError')) {
      return 'Codes must be 4-digits and alpha-numeric.';
    }
    return undefined;
  }
);
