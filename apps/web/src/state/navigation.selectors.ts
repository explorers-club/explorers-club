import {
  ClaimClubScreenActor,
  ClaimClubScreenState,
} from '../screens/claim-club/claim-club-screen.machine';
import { ClubScreenActor } from '../screens/club/club-screen.machine.old';
import { HomeScreenActor } from '../screens/home/home-screen.machine';
import { NavigationState } from './navigation.machine';

// These selectors are unsafe but should only be used by the route
// components to set up the context for the route

export const selectHomeScreenActor = (state: NavigationState) =>
  state.children['homeScreenMachine'] as HomeScreenActor;

export const selectClaimClubScreenActor = (state: ClaimClubScreenState) =>
  state.children['claimClubScreenMachine'] as ClaimClubScreenActor | undefined;

export const selectClubScreenActor = (state: NavigationState) =>
  state.children['clubScreenMachine'] as ClubScreenActor;
