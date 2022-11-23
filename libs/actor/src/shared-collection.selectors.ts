import { SharedCollectionState } from './shared-collection.machine';
import { createSelector } from 'reselect';
import { ActorID, ActorType } from './types';
import { getActorType } from './helpers';
import { AnyActorRef } from 'xstate';

const selectSharedCollectionContext = (state: SharedCollectionState) =>
  state.context;

export const selectActorRefs = createSelector(
  selectSharedCollectionContext,
  (context) => context.actorRefs
);

export const selectActorsInitialized = (state: SharedCollectionState) =>
  state.matches('Actors.Initialized');

// Selector creatores
export function createActorByTypeSelector<T extends AnyActorRef>(
  actorType: ActorType
) {
  return createSelector(
    selectActorRefs,
    (actors) =>
      Object.entries(actors)
        .filter(([actorId]) => getActorType(actorId) === actorType)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, actor]) => actor) as T[]
  );
}

export const createActorByIdSelector = (actorId: ActorID) =>
  createSelector(selectActorRefs, (actors) => actors[actorId]);