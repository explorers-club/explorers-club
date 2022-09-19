import { createSelector } from 'reselect';
import { selectNavigationChildren } from '../../state/navigation.selectors';
import { PartyScreenActor } from './party-screen.machine';

export const selectPartyScreenActor = createSelector(
  selectNavigationChildren,
  (children) => children['partyScreenMachine'] as PartyScreenActor
);
