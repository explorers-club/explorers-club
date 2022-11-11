import { ClubScreenState } from './club-screen.machine';

export const selectHostPlayerName = (state: ClubScreenState) =>
  state.context.hostPlayerName;

export const selectIsLoading = (state: ClubScreenState) =>
  state.matches('Loading');

export const selectIsClaimable = (state: ClubScreenState) =>
  state.matches('Unclaimed.Claimable');

export const selectDoesNotExist = (state: ClubScreenState) =>
  state.matches('Unclaimed.NotExist');

export const selectIsClaiming = (state: ClubScreenState) =>
  state.matches('Unclaimed.Claiming');

export const selectHasError = (state: ClubScreenState) =>
  state.matches('Error');

export const selectIsConnecting = (state: ClubScreenState) =>
  state.matches('Connecting');

export const selectIsConnected = (state: ClubScreenState) =>
  state.matches('Connected');
