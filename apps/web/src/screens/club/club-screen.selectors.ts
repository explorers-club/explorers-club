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
export const selectIsUnclaimed = (state: ClubScreenState) =>
  state.matches('Unclaimed');
export const selectIsInLobby = (state: ClubScreenState) =>
  state.matches('Lobby');
export const selectIsPlaying = (state: ClubScreenState) =>
  state.matches('Game');
