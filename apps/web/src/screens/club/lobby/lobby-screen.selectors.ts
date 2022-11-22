import { createSelector } from 'reselect';
import { LobbyScreenState } from './lobby-screen.machine';

const selectLobbyScreenContext = (state: LobbyScreenState) => state.context;

export const selectSharedCollectionActor = createSelector(
  selectLobbyScreenContext,
  (context) => context.sharedCollectionActor
);

export const selectIsSpectating = (state: LobbyScreenState) =>
  state.matches('Connected.Spectating');

export const selectIsCreatingAccount = (state: LobbyScreenState) =>
  state.matches('Connected.CreatingAccount');

export const selectIsJoining = (state: LobbyScreenState) =>
  state.matches('Connected.Joining');

export const selectIsJoined = (state: LobbyScreenState) =>
  state.matches('Connected.Joined');
