import { Flex } from '@atoms/Flex';
import { trpc } from '@explorers-club/api-client';
import { deepEqual } from '@explorers-club/utils';
import { Entity, SnowflakeId } from 'libs/api/src/ecs/schema';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

type EntityStoreState = {
  entitiesById: Map<SnowflakeId, Entity>;
};

type EntityStore = {
  subscribe: (onChange: (state: EntityStoreState) => void) => () => void;
  getSnapshot: () => EntityStoreState;
};

export const EntityStoreContext = createContext({} as EntityStore);

export const EntityStoreProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const trpcContext = trpc.useContext();
  const [store] = useState(() => {
    let state: EntityStoreState = {
      entitiesById: new Map()
    };
    const subscribe = (onChange: (state: EntityStoreState) => void) => {
      const sub = trpcContext.client.entity.all.subscribe(undefined, {
        onData(event) {
          if (event.type === 'INIT') {
            for (const entity of event.data) {
              state.entitiesById.set(entity.id, entity);
            }
          }
          if (event.type === 'ADD') {
            state.entitiesById.set(event.id, event.data);
          }
          if (event.type === 'REMOVE') {
            state.entitiesById.set(event.id, event.data);
          }
          onChange(state);
        },
      });

      return sub.unsubscribe;
    };

    const getSnapshot = () => state;

    return {
      subscribe,
      getSnapshot,
    };
  });

  return (
    <EntityStoreContext.Provider value={store}>
      {children}
    </EntityStoreContext.Provider>
  );
};
export const useEntityStore = () => {
  return useContext(EntityStoreContext);
};

export const useEntityStoreSelector = <T,>(
  selector: (state: EntityStoreState) => T
) => {
  const store = useEntityStore();
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selector
  );
};
