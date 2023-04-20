import { EntityListEvent, trpc } from '@explorers-club/api-client';
import { Entity, EntitySchema, SnowflakeId } from '@explorers-club/schema';
import { World } from 'miniplex';
import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { Observable, Subject } from 'rxjs';

// type Archetypes = {
//   room: ArchetypeBucket<RoomEntity>;
//   connection: ArchetypeBucket<ConnectionEntity>;
//   player: ArchetypeBucket<PlayerEntity>;
// };

export const WorldContext = createContext(
  {} as {
    world: World<Entity>;
    entitiesById: Map<SnowflakeId, Entity>;
    // entities$: Observable<EntityListEvent>;
    // archetypes: Archetypes;
    // useEntity$: (id: SnowflakeId) => Observable<Entity>;
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
  // const [entity$map] = useState(new Map<SnowflakeId, Observable<Entity>>());

  // const useEntity = (id: SnowflakeId) => {
  //   const entity$ = useEntity$(id);
  //   const ref = useObservableState(entity$);
  //   return ref;
  // };

  // const useEntity$ = (id: SnowflakeId) => {
  //   let entity$ = entity$map.get(id);
  //   if (!entity$) {
  //     const subject = new Subject<Entity>();
  //     // What to do about children?

  //     // client.entity.changes.subscribe(
  //     //   { id },
  //     //   {
  //     //     onData(value) {
  //     //       // subject.next(entitiesById.get(id));
  //     //     },
  //     //     onComplete() {
  //     //       subject.complete();
  //     //       entity$map.delete(id);
  //     //     },
  //     //   }
  //     // );

  //     entity$ = subject;
  //     entity$map.set(id, entity$);
  //   }

  //   entities$.subscribe((event) => {
  //     // if (event.type === "ADD") {
  //     //   // event.data.
  //     // }
  //   });

  //   return entity$;
  // };

  console.log('subsciribn');
  useEffect(() => {
    const sub = client.entity.list.subscribe(undefined, {
      onError(err) {
        console.error(err);
      },
      onData(event) {
        console.log('event', event);
        for (const entityProps of event.addedEntities) {
          console.log('added', entityProps);
        }
        for (const entityProps of event.removedEntities) {
          console.log('removed', entityProps);
          // world.remove()
        }
        for (const entityProps of event.changedEntities) {
          console.log('changed', entityProps);
        }
      },
    });

    return sub.unsubscribe;
  }, [client, world, entities$, entitiesById]);

  // const archetypes: Archetypes = {
  //   room: world.with<RoomEntity>('id', 'schema', 'roomName'),
  //   connection: world.with<ConnectionEntity>(
  //     'id',
  //     'schema',
  //     'location',
  //     'deviceId'
  //     // 'sessionId',
  //   ),
  //   player: world.with<PlayerEntity>(
  //     'id',
  //     'schema',
  //     'userId',
  //     'name',
  //     'position'
  //   ),
  // };

  return (
    <WorldContext.Provider
      value={{
        world,
        entitiesById,
        // entities$,
        // archetypes,
        // useEntity$,
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
