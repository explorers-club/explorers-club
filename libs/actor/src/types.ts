import { AnyEventObject, AnyState, AnyStateMachine } from 'xstate';
import { SharedCollectionActor } from './shared-collection.machine';

export type CreateMachineFunction = (
  props: SharedMachineProps
) => AnyStateMachine;

export type ActorID = string;

export enum ActorType {
  PARTY_ACTOR = 'PARTY_ACTOR',
  PARTY_PLAYER_ACTOR = 'PARTY_PLAYER_ACTOR',
  TRIVIA_JAM_SHARED_ACTOR = 'TRIVIA_JAM_SHARED_ACTOR',
  TRIVIA_JAM_PLAYER_ACTOR = 'TRIVIA_JAM_PLAYER_ACTOR',
  LOBBY_SHARED_ACTOR = 'LOBBY_SHARED_ACTOR',
  LOBBY_PLAYER_ACTOR = 'LOBBY_PLAYER_ACTOR',
}

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
  // sharedCollectionActor: SharedCollectionActor;
}
