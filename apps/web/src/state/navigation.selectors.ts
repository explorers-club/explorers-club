import { createSelector } from 'reselect';
import { ClaimClubScreenActor } from '../screens/claim-club/claim-club-screen.machine';
import { ClubScreenActor } from '../screens/club/club-screen.machine.old';
import { HomeScreenActor } from '../screens/home/home-screen.machine';
import { NavigationState } from './navigation.machine';

// These selectors are unsafe but should only be used by the route
// components to set up the context for the route
const selectNavigationChildren = (state: NavigationState) => state.children;

export const selectHomeScreenActor = createSelector(
  selectNavigationChildren,
  (children) => children['homeScreenMachine'] as HomeScreenActor | undefined
);

export const selectClaimClubScreenActor = createSelector(
  selectNavigationChildren,
  (children) =>
    children['claimClubScreenMachine'] as ClaimClubScreenActor | undefined
);

export const selectClubScreenActor = createSelector(
  selectNavigationChildren,
  (children) => children['clubScreenMachine'] as ClubScreenActor | undefined
);

// const selectAllActors = createSelector(
//   selectHomeScreenActor,
//   selectClaimClubScreenActor,
//   selectClubScreenActor,
//   (home, claimClub, club) => {
//     return {
//       home,
//       claimClub,
//       club,
//     };
//   }
// );
