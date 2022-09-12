import type { GameActor, LobbyActor, PartyState } from './party.machine';
import { createSelector } from 'reselect';

const selectChildren = (state: PartyState) => state.children;

const selectLobbyActor = createSelector(
  selectChildren,
  (children) => children['lobbyActor'] as LobbyActor | undefined
);

export const selectGameActor = createSelector(
  selectChildren,
  (children) => children['gameActor'] as GameActor | undefined
);

export const selectLobbyPlayer = createSelector(
  [selectLobbyActor, (_, userId) => userId],
  (lobbyActor, userId) =>
    lobbyActor
      ?.getSnapshot()
      ?.context.lobbyPlayers.find(
        (player) => player.getSnapshot()?.context.userId === userId
      )
);
