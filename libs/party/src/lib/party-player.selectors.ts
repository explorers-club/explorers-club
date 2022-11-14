import { PartyPlayerState } from './party-player.machine';

export const selectPlayerIsReady = (state: PartyPlayerState) =>
  state.matches('Ready.Yes');
