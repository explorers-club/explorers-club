import { HomeScreenState } from './home-screen.machine';

export const selectShowWelcomeBack = (state: HomeScreenState) =>
  state.matches('WelcomeBack');

export const selectNameIsAvailable = (state: HomeScreenState) =>
  state.matches('NewUserLanding.Availability.Available');

export const selectNameIsUnavailable = (state: HomeScreenState) =>
  state.matches('NewUserLanding.Availability.Unavailable');
