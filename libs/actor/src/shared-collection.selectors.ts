import { SharedCollectionState } from './shared-collection.machine';
import { createSelector } from 'reselect';
import { ActorID } from './types';

const selectSharedCollectionContext = (state: SharedCollectionState) =>
  state.context;

export const selectActorRefs = createSelector(
  selectSharedCollectionContext,
  (context) => context.actorRefs
);

export const selectActorsInitialized = (state: SharedCollectionState) =>
  state.matches('Actors.Initialized');

export const createActorByIdSelector = (actorId: ActorID) =>
  createSelector(selectActorRefs, (actors) => actors && actors[actorId]);
