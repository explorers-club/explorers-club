import { Database, DataSnapshot, onValue, ref } from 'firebase/database';
import { ActorManager } from './actor-manager';
import { ActorEvent, isSendEvent } from './events';
import { SharedActorRef } from './types';

// TODO maybe just move this function in to actorManager somehow
export const initializeActor = (
  db: Database,
  joinCode: string,
  sharedActorRef: SharedActorRef,
  actorManager: ActorManager
) => {
  const { actorId } = sharedActorRef;
  let actor = actorManager.getActor(actorId);
  // If we have already initialized this actor, do nothing.
  // Should only happen for our own local actor typically
  if (actor) {
    return;
  }

  const stateRef = ref(db, `parties/${joinCode}/actors/${actorId}/state`);
  const eventRef = ref(db, `parties/${joinCode}/actors/${actorId}/event`);

  const hydrateInitialState = (snap: DataSnapshot) => {
    const stateJSON = snap.val() as string | undefined;
    if (stateJSON) {
      actor = actorManager.hydrate({
        ...sharedActorRef,
        stateJSON,
      });
    } else {
      console.debug(`warning missing shared actor for ${actorId}`);
    }
  };

  const handleNewEvent = (snap: DataSnapshot) => {
    const event = snap.val() as ActorEvent | undefined;
    if (actor && event && isSendEvent(event)) {
      actor.send(event.payload.event);
    }
  };

  onValue(stateRef, hydrateInitialState, { onlyOnce: true });
  onValue(eventRef, handleNewEvent);
};
