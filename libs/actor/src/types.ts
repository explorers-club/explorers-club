import { AnyState } from 'xstate';
import { ActorManager } from './actor-manager';

export type ActorID = string;

export type ActorType = 'PARTY_ACTOR' | 'PLAYER_ACTOR';

export enum ActorEventType {
  SEND = 'ACTOR_SEND',
  SPAWN = 'ACTOR_SPAWN',
  SYNC_ALL = 'ACTORS_SYNC_ALL',
}

export interface SpawnProps {
  actorId: ActorID;
  actorType: ActorType;
}

export type SharedActorProps = SpawnProps & {
  state: AnyState;
};

/**
 * Props that are passed when a "shared" machine is instantiated.
 */
export interface SharedMachineProps {
  actorId: ActorID;
  actorManager: ActorManager;
}
