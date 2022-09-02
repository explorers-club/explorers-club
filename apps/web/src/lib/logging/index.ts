// Middleware for logging xstate changes
import { useEffect } from 'react';
import { ActorRef } from 'xstate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useActorLogger = (actor: ActorRef<never, any>) => {
  useEffect(() => {
    const subscription = actor.subscribe((state) => {
      // TODO only do in dev
      console.log(
        `[${actor.id}]`,
        state.event.type,
        state.value,
        state.context
      );
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [actor]);
};
