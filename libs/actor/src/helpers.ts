import { filter, fromEvent, Observable } from 'rxjs';
import { ActorManager } from './actor-manager';
import { SharedActorEvent } from './types';

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
