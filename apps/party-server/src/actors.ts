import { MachineFactory, ManagedActor } from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  PartyPlayerActor,
} from '@explorers-club/party';

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

interface PartyPlayerManagedActor extends ManagedActor {
  actorType: 'PLAYER_ACTOR';
  actor: PartyPlayerActor;
}

export function isPartyPlayer(
  managedActor: ManagedActor
): managedActor is PartyPlayerManagedActor {
  return managedActor.actorType === 'PLAYER_ACTOR';
}
