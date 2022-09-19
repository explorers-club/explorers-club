import { ActorManager } from './actor-manager';
import { useEffect, useState } from 'react';
import { ActorType } from './types';
import { AnyActorRef } from 'xstate';

export const useSelectActors = (
  actorManager: ActorManager,
  { actorType }: { actorType: ActorType }
) => {
  const [actors, setActors] = useState<AnyActorRef[]>(
    actorManager.getActorsForType(actorType)
  );

  useEffect(() => {
    const handleHydrate = () => {
      setActors(actorManager.getActorsForType(actorType));
    };

    actorManager.on('HYDRATE', handleHydrate);

    return () => {
      actorManager.off('HYDRATE', handleHydrate);
    };
  }, [actorManager, actorType]);

  return actors;
};
