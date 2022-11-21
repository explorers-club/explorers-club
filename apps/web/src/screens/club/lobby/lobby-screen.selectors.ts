import { createSelector } from 'reselect';
import { LobbyScreenState } from './lobby-screen.machine';

const selectLobbyScreenChildren = (state: LobbyScreenState) => state.children;

export const selectSharedCollectionActor = createSelector(
  selectLobbyScreenChildren,
  (children) => {
    return children['LobbyScreenMachine.Running:invocation[0]'];
  }
);
