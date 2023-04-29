import { EntityListEvent, trpc } from '@explorers-club/api-client';
import { Entity, SnowflakeId, SyncedEntityProps } from '@explorers-club/schema';
import { machineMap } from 'libs/api/src/machines';
import { World } from 'miniplex';
import { FC, ReactNode, createContext, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { produce, applyPatches, produceWithPatches } from 'immer';
import { enablePatches } from 'immer';

// type Selector<T, R> = (entity: T) => R;

type ClientEvent = { type: 'Hello' };

// Update the WorldContextType to include the entity type T.
type WorldContextType = {
  world: World<Entity>;
  // useSend: (id: SnowflakeId) => (event: ClientEvent) => void;
  // useEntitySelector: <T extends Entity, R>(
  //   id: SnowflakeId,
  //   selector: Selector<T, R>
  // ) => R;
};

export const WorldContext = createContext({} as WorldContextType);

declare global {
  interface Window {
    $WORLD: World<Entity>;
  }
}

// todo implement
// client interface will be slightly different maybe?
// but mabye not?
// then we can pass entities around easily
const createEntity = (entityProps: SyncedEntityProps<Entity>) => {
  return {} as Entity;
};

export const WorldProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { client } = trpc.useContext();
  const [world] = useState(new World<Entity>());
  window.$WORLD = world;
  const [entitiesById] = useState(new Map<SnowflakeId, Entity>()); // todo probably don't need, World tracks it's on id mapping
  // const [entities$] = useState(new Subject<EntityListEvent>());
  const subscribersById = new Map<SnowflakeId, Set<() => void>>();

  useEffect(() => {
    const sub = client.entity.list.subscribe(undefined, {
      onError(err) {
        console.error(err);
      },
      onData(event) {
        for (const entityProps of event.addedEntities) {
          const entity = createEntity(entityProps);

          entitiesById.set(entityProps.id, entity);
          world.add(entity);
        }
        for (const entityProps of event.removedEntities) {
          const entity = entitiesById.get(entityProps.id);
          if (!entity) {
            console.warn('missing entity when trying to remove');
            return;
          }

          world.remove(entity);
        }
        for (const changedEntities of event.changedEntities) {
          const entity = entitiesById.get(changedEntities.id);
          if (!entity) {
            console.warn('missing entity when trying to apply patches');
            return;
          }

          applyPatches(entity, changedEntities.patches);
        }
      },
    });

    return sub.unsubscribe;
  }, [client, world, entitiesById]);

  const eventQueue: { event: ClientEvent; id: SnowflakeId }[] = [];

  useEffect(() => {
    let running = true;
    const loop = () => {
      // Process event queue
      for (const instance of eventQueue) {
        instance.id;
        // instance.event
        // machineMap[]
      }

      if (running) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);

    return () => {
      running = false;
    };
  });

  const useSend = (id: SnowflakeId) => {
    return (event: ClientEvent) => {
      eventQueue.push({ event, id });
    };
  };

  // const useEntitySelector = <T extends Entity, R>(
  //   id: SnowflakeId,
  //   selector: Selector<T, R>
  // ) => {
  //   const subscribers = subscribersById.get(id) || new Set();
  //   if (!subscribersById.has(id)) {
  //     subscribersById.set(id, subscribers);
  //   }

  //   const getSnapshot = () => {
  //     return entitiesById.get(id) as T;
  //   };

  //   const subscribe = (onStoreChange: () => void) => {
  //     subscribers.add(onStoreChange);

  //     return () => {
  //       subscribers.delete(onStoreChange);
  //     };
  //   };

  //   return useSyncExternalStoreWithSelector(
  //     subscribe,
  //     getSnapshot,
  //     getSnapshot,
  //     selector
  //   );
  // };

  return (
    <WorldContext.Provider
      value={{
        world,
        // useSend,
        // useEntitySelector,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
};
