import { useSelector } from '@xstate/react';
import { AnyActorRef, EventObject } from 'xstate/lib/types';

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

export function useChildActor<T>(actor: AnyActorRef, stateKey: string) {
  const childKey = `${actor.id}.${stateKey}:invocation[0]`;
  const childActor = useSelector(actor, (state) => state.children[childKey]) as
    | T
    | undefined;
  return childActor;
}
