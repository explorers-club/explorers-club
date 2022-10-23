import { Database, DataSnapshot, get, onValue, ref } from 'firebase/database';
import { AnyEventObject } from 'xstate';
import { ActorManager } from './actor-manager';
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

  // const eventQueue: AnyEventObject[] = [];

  const fetchAndHydrateActor = async () => {
    const stateSnapshot = await get(stateRef);
    const stateJSON = stateSnapshot.val() as string | undefined;
    if (!stateJSON) {
      throw new Error('couldnt find state json for ' + sharedActorRef.actorId);
    }

    return actorManager.hydrate({
      ...sharedActorRef,
      stateJSON,
    });
  };

  const handleNewEvent = async (snap: DataSnapshot) => {
    // TODO need to collect any events that come in
    // here while we are fetching the actor
    // potential for timing issue currently
    const event = snap.val() as AnyEventObject | undefined;
    console.log('receive', event);
    if (event && actor) {
      console.log('before send', event, actor.getSnapshot().value, actor.getSnapshot().context);
      actor.send(event);
      console.log('after send', actor.getSnapshot().value, actor.getSnapshot().context);
    } else {
      actor = await fetchAndHydrateActor();
      // we ignore the first event if there was one since
      // since it's should be already processed
    }
  };

  onValue(eventRef, handleNewEvent);
};
