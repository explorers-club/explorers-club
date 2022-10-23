import { DatabaseReference, get, set } from 'firebase/database';
import { ActorID, SerializedSharedActor, SharedActorEvent } from './types';

export function setActorState(
  ref: DatabaseReference,
  sharedActor: SerializedSharedActor
) {
  set(ref, sharedActor);
}

export function setActorEvent(
  ref: DatabaseReference,
  payload: SharedActorEvent
) {
  set(ref, payload);
}

export async function getEventRef(
  eventsRef: DatabaseReference,
  actorId: ActorID
) {
  const eventsSnapshot = await get(eventsRef);
  let eventRef!: DatabaseReference;
  eventsSnapshot.forEach((child) => {
    const event = child.val() as SharedActorEvent;
    if (event.actorId === actorId) {
      eventRef = child.ref;
    }
  });

  return eventRef;
}
