import { useSelector } from '@xstate/react';
import { AnyActorRef } from 'xstate';
import { useEffect } from 'react';


export function useChildActor<T>(actor: AnyActorRef, stateKey: string) {
  const childKeys = useSelector(actor, (state) => Object.keys(state.children));
  const regex = RegExp(`${stateKey}:invocation\\[0\\]`);
  const key = childKeys.find((key) => key.match(regex));

  return useSelector(
    actor,
    (state) => key && (state.children[key] as T | undefined)
  ) as T;
}

export const useActorLogger = (actor?: AnyActorRef) => {
  useEffect(() => {
    if (!actor) {
      return;
    }

    const subscription = actor.subscribe((state) => {
      // TODO only do in dev
      console.log(
        `${actor.id}\n ${state.event.type}\n`,
        ` state: ${JSON.stringify(state.value)}`,
        { event: state.event, context: state.context, meta: state.meta }
      );
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [actor]);
};
