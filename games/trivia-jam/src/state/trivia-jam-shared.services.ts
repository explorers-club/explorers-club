import {
  ActorType,
  getActorId,
  SharedCollectionActor,
} from '@explorers-club/actor';
import merge from 'lodash.merge';
import {
  combineLatest,
  filter,
  first,
  firstValueFrom,
  from,
  map,
  switchMap,
} from 'rxjs';
import { TriviaJamPlayerActor } from './trivia-jam-player.machine';
import { selectPlayerIsReady } from './trivia-jam-player.selectors';
import { TriviaJamSharedEvents } from './trivia-jam-shared.machine';

export const onAllPlayersLoaded = async (
  sharedCollectionActor: SharedCollectionActor,
  playerUserIds: string[]
) => {
  const sharedCollectionState$ = from(sharedCollectionActor);
  const allPlayersLoaded$ = sharedCollectionState$.pipe(
    switchMap(({ context }) => {
      const playerObservables = playerUserIds
        .map((userId) => {
          const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
          return context.actorRefs[actorId] as TriviaJamPlayerActor;
        })
        .filter((actor) => !!actor)
        .map((actor) => from(actor));
      return combineLatest(playerObservables);
    }),
    filter(
      (playerStates) =>
        playerStates.filter((state) => selectPlayerIsReady(state)).length ===
        playerUserIds.length
    ),
    map(() => TriviaJamSharedEvents.ALL_PLAYERS_LOADED()),
    first()
  );
  return await firstValueFrom(allPlayersLoaded$);
};

export const onHostPressContinue = async (
  sharedCollectionActor: SharedCollectionActor,
  hostUserIds: string[]
) => {
  const hostPressContinue$ = from(sharedCollectionActor).pipe(
    // Map and merge
    map((state) => {
      const hostActors = hostUserIds
        .map((userId) => {
          return state.context.actorRefs[userId] as TriviaJamPlayerActor;
        })
        .filter((actor) => !!actor)
        .map((actor) => from(actor));

      return merge(hostActors);
    }),
    filter((state) => {
      // todo filter by event type
      return false;
    }),
    map(() => TriviaJamSharedEvents.HOST_PRESS_CONTINUE()),
    first()
  );
  return await firstValueFrom(hostPressContinue$);
};
