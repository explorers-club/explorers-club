import { PartyActor, PartyPlayerActor } from '@explorers-club/party';
import { ClubScreenState } from './club-screen.machine';
import { GameScreenActor } from './game/game-screen.machine';
import { LobbyScreenActor } from './lobby/lobby-screen.machine';
import { UnclaimedScreenActor } from './unclaimed';

// Invoked shild actors
export const selectUnclaimedScreenActor = (state: ClubScreenState) =>
  state.children['unclaimedScreen'] as UnclaimedScreenActor;

export const selectGameScreenActor = (state: ClubScreenState) =>
  state.children['gameScreen'] as GameScreenActor;

export const selectLobbyScreenActor = (state: ClubScreenState) =>
  state.children['lobbyScreen'] as LobbyScreenActor;

// Context selectors
export const selectHostPlayerName = (state: ClubScreenState) =>
  state.context.hostPlayerName;

// Computed states
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

export const selectPartyIsJoinable = (state: ClubScreenState) =>
  state.matches('Connected.Spectating');

export const selectShouldShowParty = (state: ClubScreenState) => true;
