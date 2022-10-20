import { DatabaseReference, set } from 'firebase/database';
import { SendActorEvent } from './events';
import { SerializedSharedActor, SharedActorRef } from './types';

export function setNewActor(
  ref: DatabaseReference,
  sharedActorRef: SharedActorRef
) {
  set(ref, sharedActorRef);
}

export function setActorState(ref: DatabaseReference, stateJSON: string) {
  set(ref, stateJSON);
}

export function setActorEvent(
  ref: DatabaseReference,
  actorState: SendActorEvent
) {
  set(ref, actorState);
}
