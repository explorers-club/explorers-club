import { filter, fromEvent, Observable } from 'rxjs';
import { EventObject } from 'xstate';
import { ActorManager } from './actor-manager';
import { ActorID, ActorType, SharedActorEvent } from './types';

/**
 * Given a list of event types, return an observable that
 * emits whenever a managed actor evmits that event
 * @param events A list of event types
 */
export const fromActorEvents = (
  actorManager: ActorManager,
  eventTypes: string[]
) => {
  const actorEvent$ = fromEvent(
    actorManager,
    'ACTOR_EVENT'
  ) as Observable<SharedActorEvent>;
  return actorEvent$.pipe(
    filter((props) => eventTypes.includes(props.event.type)) // todo make O(1)
  );
};

export const getUniqueId: (actorId: ActorID) => string = (actorId) =>
  actorId.substring(actorId.indexOf('-') + 1);

export const getActorType = (actorId: ActorID) => {
  switch (true) {
    case !!actorId.match('Party-'):
      return ActorType.PARTY_ACTOR;
    case !!actorId.match('PartyPlayer-'):
      return ActorType.PARTY_PLAYER_ACTOR;
    case !!actorId.match('TriviaJamShared-'):
      return ActorType.TRIVIA_JAM_SHARED_ACTOR;
    case !!actorId.match('TriviaJamPlayer-'):
      return ActorType.TRIVIA_JAM_PLAYER_ACTOR;
    case !!actorId.match('LobbyPlayer-'):
      return ActorType.LOBBY_PLAYER_ACTOR;
    case !!actorId.match('LobbyShared-'):
      return ActorType.LOBBY_SHARED_ACTOR;
    case !!actorId.match('DiffusionaryPlayer-'):
      return ActorType.DIFFUSIONARY_PLAYER_ACTOR;
    case !!actorId.match('DiffusionaryShared-'):
      return ActorType.DIFFUSIONARY_SHARED_ACTOR;
    default:
      throw new Error("couldn't find actor type for " + actorId);
  }
};

export const getActorId: (actorType: ActorType, uniqueId: string) => ActorID = (
  actorType,
  uniqueId
) => {
  switch (actorType) {
    case ActorType.PARTY_ACTOR:
      return `Party-${uniqueId}`;
    case ActorType.PARTY_PLAYER_ACTOR:
      return `PartyPlayer-${uniqueId}`;
    case ActorType.TRIVIA_JAM_SHARED_ACTOR:
      return `TriviaJamShared-${uniqueId}`;
    case ActorType.TRIVIA_JAM_PLAYER_ACTOR:
      return `TriviaJamPlayer-${uniqueId}`;
    case ActorType.LOBBY_PLAYER_ACTOR:
      return `LobbyPlayer-${uniqueId}`;
    case ActorType.LOBBY_SHARED_ACTOR:
      return `LobbyShared-${uniqueId}`;
    case ActorType.DIFFUSIONARY_PLAYER_ACTOR:
      return `DiffusionaryPlayer-${uniqueId}`;
    case ActorType.DIFFUSIONARY_SHARED_ACTOR:
      return `DiffusionaryShared-${uniqueId}`;
    default:
      throw new Error(`Non-existent actor type in switch: ${actorType}`);
  }
};

export function assertEventType<
  TE extends EventObject,
  TType extends TE['type']
>(event: TE, eventType: TType): asserts event is TE & { type: TType } {
  if (event.type !== eventType) {
    throw new Error(
      `Invalid event: expected "${eventType}", got "${event.type}"`
    );
  }
}

// Diff way than asserting
export const unwrapEvent = <
  T extends { type: K | string },
  K extends string = string
>(
  event: EventObject,
  expectedType: K
): T => {
  if (event.type !== expectedType)
    throw Error(
      `State machine expected an event of type: ${expectedType}, instead got: ${event.type}`
    );

  return event as T;
};

// export type ServicesFrom<T> = ReturnType<T> extends R ? R 

// export function createServices(services: unknown) {
//   return services as T;
// }
