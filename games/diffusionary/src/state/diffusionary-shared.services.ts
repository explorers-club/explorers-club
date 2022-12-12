import {
  ActorType,
  getActorId,
  selectActorRefs,
  selectSharedActor,
  SharedCollectionActor,
} from '@explorers-club/actor';
import { selectPlayerIsReady } from '../state/diffusionary-player.selectors';
import {
  combineLatest,
  filter,
  firstValueFrom,
  from,
  map,
  switchMap,
  take,
} from 'rxjs';
import {
  DiffusionaryPlayerActor,
  DiffusionaryPlayerEnterPromptEvent,
} from './diffusionary-player.machine';
import { DiffusionarySharedActor } from './diffusionary-shared.machine';
import { selectCurrentPlayer } from './diffusionary-shared.selectors';
import { createPrediction } from '../lib/replicate';

// TODO could DRY up with trivia jam
// just need to pull out the isReady selector
export const onAllPlayersReady = async (
  sharedCollectionActor: SharedCollectionActor,
  playerUserIds: string[]
) => {
  const sharedCollectionState$ = from(sharedCollectionActor);
  const allPlayersReady$ = sharedCollectionState$.pipe(
    switchMap(({ context }) => {
      const playerObservables = playerUserIds
        .map((userId) => {
          const actorId = getActorId(
            ActorType.DIFFUSIONARY_PLAYER_ACTOR,
            userId
          );
          return context.actorRefs[actorId] as DiffusionaryPlayerActor;
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
    map(() => ({
      type: 'ALL_PLAYERS_READY' as const,
    })),
    take(1)
  );
  return await firstValueFrom(allPlayersReady$);
};

export const onPlayerEnterPrompt = async (
  sharedCollectionActor: SharedCollectionActor
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sharedActor = selectSharedActor<DiffusionarySharedActor>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sharedCollectionActor.getSnapshot()!
  )!;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentPlayer = selectCurrentPlayer(sharedActor.getSnapshot()!);
  if (!currentPlayer) {
    throw new Error(
      'tried to set up enter prompt listener without current player set'
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const actorRefs = selectActorRefs(sharedCollectionActor.getSnapshot()!);
  const actor = actorRefs[
    getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, currentPlayer)
  ] as DiffusionaryPlayerActor;

  if (!actor) {
    throw new Error('couldnt find actor ref when setting up prompt listener');
  }

  const enterPrompt$ = from(actor).pipe(
    filter((state) => state.event.type === 'ENTER_PROMPT'),
    map((state) => state.event as DiffusionaryPlayerEnterPromptEvent),
    take(1)
  );
  return await firstValueFrom(enterPrompt$);
};

export const startDiffusion = async (prompt: string) => {
  const response = await createPrediction(prompt);
  const json = await response.json();
  return json.id;
};
