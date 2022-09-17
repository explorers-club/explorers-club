// Middleware for logging xstate changes
import { useEffect } from 'react';
import { AnyActorRef } from 'xstate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useActorLogger = (actor?: AnyActorRef) => {
  useEffect(() => {
    if (!actor) {
      return;
    }

    const subscription = actor.subscribe((state) => {
      // TODO only do in dev
      console.log(
        `[${actor.id}]`,
        `[type: ${state.event.type}]`,
        `[next state: ${JSON.stringify(state.value)}]`,
        { event: state.event, context: state.context, actor }
      );
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [actor]);
};
