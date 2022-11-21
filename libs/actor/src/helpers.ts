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
    case !!actorId.match('TriviaJam-'):
      return ActorType.TRIVIA_JAM_ACTOR;
    case !!actorId.match('TriviaJamPlayer-'):
      return ActorType.TRIVIA_JAM_PLAYER_ACTOR;
    case !!actorId.match('LobbyPlayer-'):
      return ActorType.LOBBY_PLAYER_ACTOR;
    case !!actorId.match('LobbyServer-'):
      return ActorType.LOBBY_SERVER_ACTOR;
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
    case ActorType.TRIVIA_JAM_ACTOR:
      return `TriviaJam-${uniqueId}`;
    case ActorType.TRIVIA_JAM_PLAYER_ACTOR:
      return `TriviaJamPlayer-${uniqueId}`;
    case ActorType.LOBBY_PLAYER_ACTOR:
      return `LobbyPLayer-${uniqueId}`;
    case ActorType.LOBBY_SERVER_ACTOR:
      return `LobbyServer-${uniqueId}`;
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
