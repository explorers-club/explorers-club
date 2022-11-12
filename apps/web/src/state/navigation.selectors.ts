import { ClubScreenActor } from '../routes/club/club-screen.machine';
import { HomeScreenActor } from '../routes/home/home-screen.machine';
import { NavigationState } from './navigation.machine';

export const selectHomeScreenActor = (state: NavigationState) =>
  state.children['homeScreenMachine'] as HomeScreenActor;

export const selectClubScreenActor = (state: NavigationState) =>
  state.children['clubScreenMachine'] as ClubScreenActor;
