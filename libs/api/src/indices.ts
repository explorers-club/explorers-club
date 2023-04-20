import {
  Entity,
  EntitySchemas,
  SchemaType,
  SnowflakeId,
  UserEntityDeltaSchema,
} from '@explorers-club/schema';
import { FromArchetype, FromSubject } from '@explorers-club/utils';
import { ArchetypeBucket, World } from 'miniplex';
import { Observable, Subject } from 'rxjs';
import { AnyFunction } from 'xstate';
import { z } from 'zod';
import { EntityChangeDelta, EntityIndexEvent } from './events';

type IndexFunction = (entity: Entity) => string;

type IndexKey = string | string[] | IndexFunction;

export const createSchemaIndex = <TKey extends IndexKey>(
  world: World<Entity>,
  schemaType: SchemaType,
  key: TKey
) => {
  const schema = EntitySchemas[schemaType];
  type TEntity = z.infer<typeof schema>;

  const index = new Map<string, TEntity>();
  const subject = new Subject<EntityIndexEvent<TEntity>>();

  const getIndexKey = (entity: TEntity) => {
    if (typeof key === 'function') {
      return key(entity);
    } else if (typeof key === 'string') {
      return entity[key as keyof TEntity];
    } else {
      return key
        .map((keyComponent) => entity[keyComponent as keyof TEntity])
        .join('-');
    }
  };

  const entitySubscriptionsMap = new Map<SnowflakeId, AnyFunction>();

  world.onEntityAdded.add((entity) => {
    if (entity.schema !== schemaType) {
      return;
    }

    const key = getIndexKey(entity) as string;
    if (index.has(key)) {
      console.warn('index received duplicate key igorning', key);
      return;
    }

    index.set(key, entity);
    subject.next({
      type: 'ADD',
      data: entity,
    });

    const entitySubscription = entity.subscribe((event) => {
      if (event.type === 'CHANGE') {
        subject.next({
          type: 'CHANGE',
          data: entity,
          delta: event.delta as EntityChangeDelta<TEntity>,
        });
      }
    });

    entitySubscriptionsMap.set(entity.id, entitySubscription);
  });

  world.onEntityRemoved.add((entity) => {
    if (entity.schema !== schemaType) {
      return;
    }

    const key = getIndexKey(entity) as string;
    index.delete(key);

    const entitySubscription = entitySubscriptionsMap.get(entity.id);
    if (entitySubscription) {
      entitySubscription();
    } else {
      console.warn(
        "expected entity subscritption but didn't find one for ",
        entity.id
      );
    }

    subject.next({
      type: 'REMOVE',
      data: entity,
    });
  });

  subject.next({
    type: 'INIT',
    data: world.entities, // todo filter for access
  });

  return [index, subject as Observable<FromSubject<typeof subject>>] as const;
};

/**
 * Given a bucket and a prop name to use as an index key, returns back
 * a tuple that includes a map of all the items in the index, indexed
 * by the key, and an observable that emits events when a change on
 * any entity happens
 * @param bucket
 * @param indexKey
 * @returns
 */
// export const createArchetypeIndex = <TEntity extends Entity>(
//   bucket: ArchetypeBucket<TEntity>,
//   indexKey: keyof TEntity | ((data: TEntity) => string)
// ) => {
//   type BucketEntity = FromArchetype<typeof bucket>;
//   const index = new Map<string, BucketEntity>();
//   const subject = new Subject<EntityIndexEvent<TEntity>>();

//   const getKey = (entity: TEntity) => {
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
//     data: bucket.entities,
//   });

//   const entitySubscriptionsMap = new Map<SnowflakeId, AnyFunction>();

//   bucket.onEntityAdded.add((entity) => {
//     const key = getKey(entity);
//     if (index.has(key)) {
//       console.warn('index received duplicate key. igorning', key);
//     }

//     index.set(key, entity);
//     subject.next({
//       type: 'ADD',
//       data: entity,
//     });

//     const entitySubscription = entity.subscribe((event) => {
//       if (event.type === 'CHANGE') {
//         subject.next({
//           type: 'CHANGE',
//           data: entity,
//           delta: event.delta as EntityChangeDelta<TEntity>,
//         });
//       }
//     });

//     entitySubscriptionsMap.set(entity.id, entitySubscription);
//   });

//   bucket.onEntityRemoved.add((entity) => {
//     const key = getKey(entity);
//     index.delete(key);

//     const entitySubscription = entitySubscriptionsMap.get(entity.id);
//     if (entitySubscription) {
//       entitySubscription(); //
//     } else {
//       console.warn(
//         "expected entity subscritption but didn't find one for ",
//         entity.id
//       );
//     }

//     subject.next({
//       type: 'REMOVE',
//       data: entity,
//     });
//   });

//   return [index, subject as Observable<FromSubject<typeof subject>>] as const;
// };
