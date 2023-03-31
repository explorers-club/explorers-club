import {
  ECEpochTimestamp,
  EntityBase,
  SnowflakeId,
} from '@explorers-club/schema';
import { ArchetypeBucket } from 'miniplex';
import { Observable, Subject } from 'rxjs';

const TICK_RATE = 60;


export type FromArchetype<T extends ArchetypeBucket<any>> =
  T extends ArchetypeBucket<infer U> ? U : never;

export const getCurrentTimestamp = () => {
  return 1111111;
};

export const generateSnowflakeId = () => {
  return Math.random().toString(); // todo actual
};

// Create an index, subscribe when it changes
// Pass in a function to get the entities id

// const createArchetypeIndex = <TData extends { schema: EntityBase['schema'] }>(
//   bucket: ArchetypeBucket<TData>
// //   indexKey: keyof TData | ((data: TData) => string)
// ) => {
//   const index = new Map<string, FromArchetype<typeof bucket>>();
//   const subject = new Subject<ArchetypeIndexEvent<TData>>();

//   bucket.first
//   bucket.query

//   const getKey = (entity: TData) => {
//     if (typeof indexKey === 'function') {
//       return indexKey(entity) as string;
//     } else {
//       return entity[indexKey] as string;
//     }
//   };

//   for (const entity of bucket) {
//     const key = getKey(entity);
//     index.set(key, entity);
//   }

//   subject.next({
//     type: 'INIT',
//     keys: bucket.entities.map(getKey),
//     data: bucket.entities,
//   });

//   bucket.onEntityAdded.add((entity) => {
//     const key = getKey(entity);
//     index.set(key, entity);
//     subject.next({
//       key,
//       type: 'ADD',
//       data: entity,
//     });
//   });
//   bucket.onEntityRemoved.add((entity) => {
//     const key = getKey(entity);
//     index.delete(key);
//     subject.next({
//       key,
//       type: 'REMOVE',
//       data: entity,
//     });
//   });

//   return [index, subject as Observable<ArchetypeEvent<TData>>] as const;
// };

export const createArchetypeIndex = <TData>(
  bucket: ArchetypeBucket<TData>,
  indexKey: keyof TData | ((data: TData) => string)
) => {
  const index = new Map<string, FromArchetype<typeof bucket>>();
  const subject = new Subject<ArchetypeIndexEvent<TData>>();

  const getKey = (entity: TData) => {
    if (typeof indexKey === 'function') {
      return indexKey(entity) as string;
    } else {
      return entity[indexKey] as string;
    }
  };

  for (const entity of bucket) {
    const key = getKey(entity);
    index.set(key, entity);
  }

  subject.next({
    type: 'INIT',
    keys: bucket.entities.map(getKey),
    data: bucket.entities,
  });

  bucket.onEntityAdded.add((entity) => {
    const key = getKey(entity);
    index.set(key, entity);
    subject.next({
      key,
      type: 'ADD',
      data: entity,
    });
  });
  bucket.onEntityRemoved.add((entity) => {
    const key = getKey(entity);
    index.delete(key);
    subject.next({
      key,
      type: 'REMOVE',
      data: entity,
    });
  });

  return [index, subject as Observable<ArchetypeIndexEvent<TData>>] as const;
};

type ArchetypeInitEvent<T> = { type: 'INIT'; data: T[] };
type ArchetypeChangeEvent<T> = { type: 'CHANGE'; data: T };
type ArchetypeAddEvent<T> = { type: 'ADD'; data: T };
type ArchetypeRemoveEvent<T> = { type: 'REMOVE'; data: T };

export function isArchetypeInitEvent<T>(
  event: ArchetypeEvent<T>
): event is ArchetypeInitEvent<T> {
  return event.type === 'INIT';
}

export function isArchetypeChangeEvent<T>(
  event: ArchetypeEvent<T>
): event is ArchetypeChangeEvent<T> {
  return event.type === 'CHANGE';
}

export function isArchetypeEntityEvent<T>(
  event: ArchetypeEvent<T>
): event is ArchetypeAddEvent<T> {
  // todo this is wrong
  return (
    event.type === 'ADD' || event.type === 'CHANGE' || event.type === 'REMOVE'
  );
}

export function isArchetypeAddEvent<T>(
  event: ArchetypeEvent<T>
): event is ArchetypeAddEvent<T> {
  return event.type === 'ADD';
}

export function isArchetypeRemoveEvent<T>(
  event: ArchetypeEvent<T>
): event is ArchetypeRemoveEvent<T> {
  return event.type === 'REMOVE';
}

export function isArchetypeListEvent<T>(
  event: ArchetypeEvent<T>
): event is ArchetypeListEvent<T> {
  return (
    event.type === 'REMOVE' || event.type === 'ADD' || event.type === 'INIT'
  );
}

export type ArchetypeIndexEvent<T> =
  | (ArchetypeInitEvent<T> & { keys: string[] })
  | (ArchetypeAddEvent<T> & { key: string })
  | (ArchetypeRemoveEvent<T> & { key: string });

export type ArchetypeEvent<T> =
  | ArchetypeInitEvent<T>
  | ArchetypeChangeEvent<T>
  | ArchetypeAddEvent<T>
  | ArchetypeRemoveEvent<T>;

export type ArchetypeListEvent<T> =
  | ArchetypeInitEvent<T>
  | ArchetypeAddEvent<T>
  | ArchetypeRemoveEvent<T>;

export type ArchetypeEntityEvent<T> =
  | ArchetypeChangeEvent<T>
  | ArchetypeAddEvent<T>
  | ArchetypeRemoveEvent<T>;

/**
 * Given an archetype bucket, returns an observable that broadcasts init, add, change, and remove events for it.
 * @param bucket
 * @returns
 */
// export const createArchetypeEvent$ = <
//   T extends {
//     id: SnowflakeId;
//     flushedAt: ECEpochTimestamp;
//   }
// >(
//   bucket: ArchetypeBucket<T>
// ) => {
//   const event$ = new Observable<ArchetypeEvent<T>>((observer) => {
//     observer.next({ type: 'INIT', data: bucket.entities });

//     // On every tick, iterate through each entity and
//     // check to see if it's 'flushedAt' has been updated.
//     // todo in future maybe we use proxies instead of explicit flushing?
//     // flushing could be useful but also might cause errors
//     // compromise could be auto-flush w/ override
//     const lastFlushedAtMap = new Map<SnowflakeId, ECEpochTimestamp>();
//     setInterval(() => {
//       for (const entity of bucket) {
//         const lastFlushedAt = lastFlushedAtMap.get(entity.id);
//         if (lastFlushedAt !== entity.flushedAt) {
//           lastFlushedAtMap.set(entity.id, entity.flushedAt);
//           observer.next({
//             id: entity.id,
//             type: 'CHANGE',
//             data: entity,
//           });
//         }
//       }
//     }, 1000 / TICK_RATE);

//     bucket.onEntityAdded.add((entity) => {
//       observer.next({
//         id: entity.id,
//         type: 'ADD',
//         data: entity,
//       });
//       lastFlushedAtMap.set(entity.id, entity.flushedAt);
//     });
//     bucket.onEntityRemoved.add((entity) => {
//       observer.next({
//         id: entity.id,
//         type: 'REMOVE',
//         data: entity,
//       });
//       lastFlushedAtMap.set(entity.id, entity.flushedAt);
//     });
//   });
//   return event$;
// };
