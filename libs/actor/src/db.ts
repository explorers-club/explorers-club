import { Database, ref, set } from 'firebase/database';
import { AnyActorRef } from 'xstate';
import { ActorID } from './types';
import { serverTimestamp } from '@firebase/database';
// SimpleDateFormat ISO_8601_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:sss'Z'");

export const saveActorState = async (
  db: Database,
  rootPath: string,
  actorId: ActorID,
  actor: AnyActorRef
) => {
  const myStateRef = ref(db, `${rootPath}/actor_state/${actorId}`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const state = actor.getSnapshot()!;
  const stateJSON = JSON.stringify(state);

  return set(myStateRef, stateJSON);
};

export const saveActorEvent = async (
  db: Database,
  rootPath: string,
  actorId: ActorID,
  actor: AnyActorRef
) => {
  const myEventRef = ref(db, `${rootPath}/actor_events/${actorId}`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const state = JSON.parse(JSON.stringify(actor.getSnapshot()!));

  // parsing gets rid of a `toString` function which causes firebase to error
  const event = JSON.parse(JSON.stringify(state.event));
  event.sentAt = serverTimestamp();
  return set(myEventRef, event);
};

// export function setActorEvent(
//   ref: DatabaseReference,
//   payload: SharedActorEvent
// ) {
//   set(ref, payload);
// }

// export async function getEventRef(
//   eventsRef: DatabaseReference,
//   actorId: ActorID
// ) {
//   const eventsSnapshot = await get(eventsRef);
//   let eventRef!: DatabaseReference;
//   eventsSnapshot.forEach((child) => {
//     const event = child.val() as SharedActorEvent;
//     if (event.actorId === actorId) {
//       eventRef = child.ref;
//     }
//   });

//   return eventRef;
// }
