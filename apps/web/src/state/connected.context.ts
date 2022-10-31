import { ActorManager } from '@explorers-club/actor';
import { PartyActor } from '@explorers-club/party';
import { createContext } from 'react';

export const ConnectedContext = createContext({
  partyActor: {} as PartyActor,
  actorManager: {} as ActorManager,
});
