import { useEffect } from 'react';
import { Actor } from 'xstate';

export const useActorLogger = (actor: Actor) => {
  useEffect(() => {
    const subscription = actor.subscribe((state) => {
      // TODO prod check
      console.log(`Actor ${actor.id}`, state.event, state.value, state.context);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [actor]);
};
