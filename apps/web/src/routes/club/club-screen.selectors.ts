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
