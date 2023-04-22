import { Entity } from '@explorers-club/schema';

export type EntityChangeDelta<TEntity extends Entity> = {
  property: keyof TEntity;
  value: TEntity[keyof TEntity];
  prevValue: TEntity[keyof TEntity];
};

export interface EntityPropChangeEvent<TEntity extends Entity> {
  type: 'CHANGE';
  data: TEntity;
  delta: EntityChangeDelta<TEntity>;
}

export type EntityIndexInitEvent<TEntity extends Entity> = {
  type: 'INIT';
  data: TEntity[];
};

export type EntityIndexAddEvent<TEntity extends Entity> = {
  type: 'ADD';
  data: TEntity;
};

export type EntityIndexRemoveEvent<TEntity extends Entity> = {
  type: 'REMOVE';
  data: TEntity;
};

export type EntityIndexEvent<TEntity extends Entity> =
  | EntityPropChangeEvent<TEntity>
  | EntityIndexInitEvent<TEntity>
  | EntityIndexAddEvent<TEntity>
  | EntityIndexRemoveEvent<TEntity>;

export function isEntityPropChangeEvent<TEntity extends Entity>(
  event: EntityIndexEvent<TEntity>
): event is EntityPropChangeEvent<TEntity> {
  return event.type === 'CHANGE';
}

export function isEntitiesInitEvent<TEntity extends Entity>(
  event: EntityIndexEvent<TEntity>
): event is EntityIndexInitEvent<TEntity> {
  return event.type === 'INIT';
}

export function isEntityAddEvent<TEntity extends Entity>(
  event: EntityIndexEvent<TEntity>
): event is EntityIndexAddEvent<TEntity> {
  return event.type === 'ADD';
}

export function isEntityRemoveEvent<TEntity extends Entity>(
  event: EntityIndexEvent<TEntity>
): event is EntityIndexRemoveEvent<TEntity> {
  return event.type === 'REMOVE';
}
