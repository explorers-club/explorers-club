import { AnyEventObject, AnyState } from 'xstate';
import { ActorManager } from './actor-manager';

export type ActorID = string;

export type ActorType =
  | 'PARTY_ACTOR'
  | 'PLAYER_ACTOR'
  | 'TREEHOUSE_TRIVIA_ACTOR'
  | 'TREEHOUSE_TRIVIA_PLAYER_ACTOR';

export enum ActorEventType {
  SEND = 'ACTOR_SEND',
  SPAWN = 'ACTOR_SPAWN',
  SYNC_ALL = 'ACTORS_SYNC_ALL',
}

export interface SharedActorRef {
  actorId: ActorID;
  actorType: ActorType;
}

export interface SharedActorEvent {
  actorId: ActorID;
  event: AnyEventObject;
}

export type SharedActor = SharedActorRef & {
  state: AnyState;
};

export type SerializedSharedActor = SharedActorRef & {
  stateJSON: string;
};

/**
 * Props that are passed when a "shared" machine is instantiated.
 */
export interface SharedMachineProps {
  actorId: ActorID;
  actorManager: ActorManager;
}
