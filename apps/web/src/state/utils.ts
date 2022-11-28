import { useSelector } from '@xstate/react';
import { AnyActorRef } from 'xstate/lib/types';

export function useChildActor<T>(actor: AnyActorRef, stateKey: string) {
  const childKeys = useSelector(actor, (state) => Object.keys(state.children));
  const regex = RegExp(`${stateKey}:invocation\\[0\\]`);
  const key = childKeys.find((key) => key.match(regex));

  return useSelector(
    actor,
    (state) => key && (state.children[key] as T | undefined)
  ) as T;
}
