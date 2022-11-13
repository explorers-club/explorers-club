import { useSelector } from '@xstate/react';
import { AnyActorRef, AnyState, EventObject } from 'xstate/lib/types';

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
  const childKeys = useSelector(actor, (state) => Object.keys(state.children));
  const regex = RegExp(`${stateKey}:invocation\\[0\\]`);
  const key = childKeys.find((key) => key.match(regex));

  return useSelector(
    actor,
    (state) => key && (state.children[key] as T | undefined)
  );
}
