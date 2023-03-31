import {
  EntityChangeEvent,
  EntityListEvent,
  trpc,
} from '@explorers-club/api-client';
import {
  ConnectionEntity,
  Entity,
  EntitySchema,
  PlayerEntity,
  RoomEntity,
  SnowflakeId,
} from '@explorers-club/schema';
import { ArchetypeBucket, World } from 'miniplex';
import { useObservableState, useSubscription } from 'observable-hooks';
import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { Observable, Subject } from 'rxjs';

type Archetypes = {
  room: ArchetypeBucket<RoomEntity>;
  connection: ArchetypeBucket<ConnectionEntity>;
  player: ArchetypeBucket<PlayerEntity>;
};

export const WorldContext = createContext(
  {} as {
    world: World<Entity>;
    entitiesById: Map<SnowflakeId, Entity>;
    entities$: Observable<EntityListEvent>;
    archetypes: Archetypes;
    useEntity$: (id: SnowflakeId) => Observable<Entity>;
  }
);

declare global {
  interface Window {
    $WORLD: World<Entity>;
  }
}

export const WorldProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { client } = trpc.useContext();
  const [world] = useState(new World<Entity>());
  window.$WORLD = world;
  const [entitiesById] = useState(new Map<SnowflakeId, Entity>()); // todo probably don't need, World tracks it's on id mapping
  const [entities$] = useState(new Subject<EntityListEvent>());
  const [entity$map] = useState(new Map<SnowflakeId, Observable<Entity>>());

  // const useEntity = (id: SnowflakeId) => {
  //   const entity$ = useEntity$(id);
  //   const ref = useObservableState(entity$);
  //   return ref;
  // };

  const useEntity$ = (id: SnowflakeId) => {
    let entity$ = entity$map.get(id);
    if (!entity$) {
      const subject = new Subject<Entity>();
      // What to do about children?

      client.entity.changes.subscribe(
        { id },
        {
          onData(value) {
            subject.next(value.data);
          },
          onComplete() {
            subject.complete();
            entity$map.delete(id);
          },
        }
      );

      entity$ = subject;
      entity$map.set(id, entity$);
    }

    return entity$;
  };

  useEffect(() => {
    const sub = client.entity.list.subscribe(undefined, {
      onData(event) {
        if (event.type === 'INIT') {
          for (const data of event.data) {
            const entity = EntitySchema.parse(data);
            entitiesById.set(entity.id, entity);
            world.add(entity);
          }
        }
        if (event.type === 'ADD') {
          const entity = EntitySchema.parse(event.data);
          world.remove(entity);
          entitiesById.set(event.data.id, entity);
        }
        if (event.type === 'REMOVE') {
          const entity = entitiesById.get(event.data.id);
          if (entity) {
            world.remove(entity);
            entitiesById.delete(event.data.id);
          }
        }
        entities$.next(event);
      },
    });

    return sub.unsubscribe;
  }, [client, world, entities$, entitiesById]);

  const archetypes: Archetypes = {
    room: world.with<RoomEntity>('id', 'schema', 'roomName'),
    connection: world.with<ConnectionEntity>(
      'id',
      'schema',
      'location',
      'deviceId'
      // 'sessionId',
    ),
    player: world.with<PlayerEntity>(
      'id',
      'schema',
      'userId',
      'name',
      'position'
    ),
  };

  return (
    <WorldContext.Provider
      value={{
        world,
        entitiesById,
        entities$,
        archetypes,
        useEntity$,
        // useEntity,
        // waitForEntity: (query) => {
        //   const findEntity = () => {
        //     const entities = world.where(...query);
        //     for (const entity of entities) {
        //       return entity;
        //     }
        //     return null;
        //   };

        //   return new Promise<Entity>((resolve) => {
        //     const entity = findEntity();
        //     if (entity) {
        //       resolve(entity);
        //     }

        //     const sub = entity$.subscribe((event) => {
        //       const entity = findEntity();
        //       if (entity) {
        //         resolve(entity);
        //         sub.unsubscribe();
        //       }
        //     });
        //   });
        // },
      }}
    >
      {children}
    </WorldContext.Provider>
  );
};
