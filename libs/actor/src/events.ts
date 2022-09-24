import { AnyEventObject, AnyActorRef } from 'xstate';
import {
  ActorEventType,
  ActorID,
  SharedActorRef,
  SerializedSharedActor,
} from './types';

const SPAWN = ({
  actorId,
  actorType,
  actor,
}: SharedActorRef & { actor: AnyActorRef }) => {
  const stateJSON = JSON.stringify(actor.getSnapshot());
  return {
    type: ActorEventType.SPAWN,
    payload: {
      actorId,
      actorType,
      stateJSON,
    } as SerializedSharedActor,
  };
};

const SEND = (payload: { actorId: ActorID; event: AnyEventObject }) => ({
  type: ActorEventType.SEND,
  payload,
});

type SendActorEvent = ReturnType<typeof SEND>;
type SpawnActorEvent = ReturnType<typeof SPAWN>;

export type ActorEvent = SpawnActorEvent | SendActorEvent;

export const ActorEvents = {
  SEND,
  SPAWN,
};
