import { PartyActor } from '@explorers-club/party';
import { ClubScreenState } from './club-screen.machine';

export const selectHostPlayerName = (state: ClubScreenState) =>
  state.context.hostPlayerName;

export const selectPartyActor = (state: ClubScreenState) =>
  state.context.partyActor as PartyActor | undefined;

export const selectGameSelectionActor = (state: ClubScreenState) =>
  state.context.partyActor as PartyActor | undefined;

export const selectActorManager = (state: ClubScreenState) =>
  state.context.actorManager;

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

export const selectIsCreatingAccount = (state: ClubScreenState) =>
  state.matches('Connected.CreateAccount');

export const selectIsJoined = (state: ClubScreenState) =>
  state.matches('Connected.Joined');

export const selectIsJoining = (state: ClubScreenState) =>
  state.matches('Connected.Joining');

export const selectIsSpectating = (state: ClubScreenState) =>
  state.matches('Connected.Spectating');

export const selectShouldShowParty = (state: ClubScreenState) => true;
