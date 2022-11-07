import { filter, fromEvent, Observable } from 'rxjs';
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

export const getActorId: (actorType: ActorType, uniqueId: string) => ActorID = (
  actorType,
  uniqueId
) => {
  switch (actorType) {
    case ActorType.PARTY_ACTOR:
      return `Party-${uniqueId}`;
    case ActorType.PARTY_PLAYER_ACTOR:
      return `PartyPlayer-${uniqueId}`;
    case ActorType.TREEHOUSE_TRIVIA_ACTOR:
      return `TreehouseTrivia-${uniqueId}`;
    case ActorType.TREEHOUSE_TRIVIA_PLAYER_ACTOR:
      return `TreehouseTriviaPlayer-${uniqueId}`;
    default:
      throw new Error(`Non-existent actor type in switch: ${actorType}`);
  }
};
