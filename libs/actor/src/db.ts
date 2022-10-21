import { DatabaseReference, set } from 'firebase/database';
import { AnyEventObject } from 'xstate';
import { SharedActorRef } from './types';

export function setNewActor(
  ref: DatabaseReference,
  sharedActorRef: SharedActorRef
) {
  set(ref, sharedActorRef);
}

export function setActorState(ref: DatabaseReference, stateJSON: string) {
  set(ref, stateJSON);
}

export function setActorEvent(ref: DatabaseReference, event: AnyEventObject) {
  set(ref, event);
}
