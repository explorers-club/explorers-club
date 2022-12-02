import { Database, ref, set } from 'firebase/database';
import { AnyActorRef } from 'xstate';
import { ActorID } from './types';

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
  const state = actor.getSnapshot()!;
  return set(myEventRef, state.event);
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
