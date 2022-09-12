import { PartyConnectionState } from './party-connection.machine';

export const selectPartyActor = (state: PartyConnectionState) =>
  state.context.partyActor;
