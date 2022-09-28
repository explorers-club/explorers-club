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

const SEND = ({
  actorId,
  event,
}: {
  actorId: ActorID;
  event: AnyEventObject;
}) => ({
  type: ActorEventType.SEND,
  payload: {
    actorId,
    event,
  },
});

export type SendActorEvent = ReturnType<typeof SEND>;
export type SpawnActorEvent = ReturnType<typeof SPAWN>;

export type ActorEvent = SpawnActorEvent | SendActorEvent;

export function isSpawnEvent(event: ActorEvent): event is SpawnActorEvent {
  return event.type === ActorEventType.SPAWN;
}

export function isSendEvent(event: ActorEvent): event is SendActorEvent {
  return event.type === ActorEventType.SEND;
}

export const ActorEvents = {
  SEND,
  SPAWN,
};
