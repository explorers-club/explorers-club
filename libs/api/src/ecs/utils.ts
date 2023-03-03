import { ArchetypeBucket } from 'miniplex';
import { z } from 'zod';
import { Observable } from 'rxjs';
import { TICK_RATE } from '../constants';
import { FromArchetype } from './archetypes';
import {
  ECEpochTimestamp,
  EntitySchema,
  SnowflakeId,
  SnowflakeIdSchema,
} from './schema';

export const getCurrentTimestamp = () => {
  return 1111111;
};

export const generateSnowflakeId = () => {
  return Math.random().toString(); // todo actual
};

export const createArchetypeIndex = <T extends { id: SnowflakeId }>(
  bucket: ArchetypeBucket<T>
) => {
  const index = new Map<string, FromArchetype<typeof bucket>>();
  bucket.onEntityAdded.add((entity) => {
    index.set(entity.id, entity);
  });
  bucket.onEntityRemoved.add((entity) => {
    index.delete(entity.id);
  });
  // todo add an event emitter here for changes
  return index;
};

type ArchetypeInitEvent<T> = { type: 'INIT'; data: T[] };
type ArchetypeChangeEvent<T> = { id: SnowflakeId; type: 'CHANGE'; data: T };
type ArchetypeAddEvent<T> = { id: SnowflakeId; type: 'ADD'; data: T };
type ArchetypeRemoveEvent<T> = { id: SnowflakeId; type: 'REMOVE'; data: T };

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
): event is ArchetypeAddEvent<T> {
  return (
    event.type === 'REMOVE' || event.type === 'ADD' || event.type === 'INIT'
  );
}

type ArchetypeEvent<T> =
  | ArchetypeInitEvent<T>
  | ArchetypeChangeEvent<T>
  | ArchetypeAddEvent<T>
  | ArchetypeRemoveEvent<T>;

/**
 * Given an archetype bucket, returns an observable that broadcasts init, add, change, and remove events for it.
 * @param bucket
 * @returns
 */
export const createArchetypeEvent$ = <
  T extends {
    id: SnowflakeId;
    flushedAt: ECEpochTimestamp;
  }
>(
  bucket: ArchetypeBucket<T>
) => {
  const event$ = new Observable<ArchetypeEvent<T>>((observer) => {
    observer.next({ type: 'INIT', data: bucket.entities });

    // On every tick, iterate through each entity and
    // check to see if it's 'flushedAt' has been updated.
    // todo in future maybe we use proxies instead of explicit flushing?
    // flushing could be useful but also might cause errors
    // compromise could be auto-flush w/ override
    const lastFlushedAtMap = new Map<SnowflakeId, ECEpochTimestamp>();
    setInterval(() => {
      for (const entity of bucket) {
        const lastFlushedAt = lastFlushedAtMap.get(entity.id);
        if (lastFlushedAt !== entity.flushedAt) {
          lastFlushedAtMap.set(entity.id, entity.flushedAt);
          observer.next({
            id: entity.id,
            type: 'CHANGE',
            data: entity,
          });
        }
      }
    }, 1000 / TICK_RATE);

    bucket.onEntityAdded.add((entity) => {
      observer.next({
        id: entity.id,
        type: 'ADD',
        data: entity,
      });
      lastFlushedAtMap.set(entity.id, entity.flushedAt);
    });
    bucket.onEntityRemoved.add((entity) => {
      observer.next({
        id: entity.id,
        type: 'REMOVE',
        data: entity,
      });
      lastFlushedAtMap.set(entity.id, entity.flushedAt);
    });
  });
  return event$;
};
