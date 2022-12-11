import {
  ActorType,
  getActorId,
  selectActorRefs,
  selectSharedActor,
  SharedCollectionActor,
} from '@explorers-club/actor';
import { selectPlayerIsReady } from '../state/diffusionary-player.selectors';
import { sleep } from '@explorers-club/utils';
import {
  combineLatest,
  filter,
  firstValueFrom,
  from,
  map,
  switchMap,
  take,
} from 'rxjs';
import { DiffusionaryPlayerActor } from './diffusionary-player.machine';
import { DiffusionarySharedActor } from './diffusionary-shared.machine';
import { selectCurrentPlayer } from './diffusionary-shared.selectors';

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
    map((state) => state.event),
    filter((event) => event.type === 'ENTER_PROMPT'),
    take(1)
  );
  return await firstValueFrom(enterPrompt$);
};

// import {
//   ActorType,
//   getActorId,
//   SharedCollectionActor,
// } from '@explorers-club/actor';
// import { sleep } from '@explorers-club/utils';
// import {
//   combineLatest,
//   filter,
//   firstValueFrom,
//   from,
//   fromEventPattern,
//   map,
//   Observable,
//   Subscription,
//   switchMap,
//   take,
// } from 'rxjs';
// import { TriviaJamPlayerActor } from './trivia-jam-player.machine';
// import { selectPlayerIsReady } from './trivia-jam-player.selectors';
// import {
//   TriviaJamSharedEvents,
//   TriviaJamSharedHostPressContinueEvent,
// } from './trivia-jam-shared.machine';

// export const onShowQuestionPromptComplete = async () => {
//   await sleep(5000);
//   return Promise.resolve(TriviaJamSharedEvents.SHOW_QUESTION_PROMPT_COMPLETE());
// };

// export const onResponseComplete = async () => {
//   return Promise.resolve(TriviaJamSharedEvents.RESPONSE_COMPLETE());
// };

// export const onAllPlayersLoaded = async (
//   sharedCollectionActor: SharedCollectionActor,
//   playerUserIds: string[]
// ) => {
//   const sharedCollectionState$ = from(sharedCollectionActor);
//   const allPlayersLoaded$ = sharedCollectionState$.pipe(
//     switchMap(({ context }) => {
//       const playerObservables = playerUserIds
//         .map((userId) => {
//           const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
//           return context.actorRefs[actorId] as TriviaJamPlayerActor;
//         })
//         .filter((actor) => !!actor)
//         .map((actor) => from(actor));
//       return combineLatest(playerObservables);
//     }),
//     filter(
//       (playerStates) =>
//         playerStates.filter((state) => selectPlayerIsReady(state)).length ===
//         playerUserIds.length
//     ),
//     map(() => TriviaJamSharedEvents.ALL_PLAYERS_LOADED()),
//     take(1)
//   );
//   return await firstValueFrom(allPlayersLoaded$);
// };

// // TODO hack, make more generic
// // we cant use from() because for some reaseon the event gets stripped and we need it to check the type
// export const fromEvent$ = (actor: TriviaJamPlayerActor, type: string) =>
//   fromEventPattern(
//     (handler) => {
//       let skip = true; // hacky way to skip first, again cant use from()
//       return actor.subscribe(({ event }) => {
//         if (skip) {
//           skip = false;
//           return;
//         }
//         if (event.type === type) {
//           handler(event);
//         }
//       });
//     },
//     (_, sub: Subscription) => sub.unsubscribe()
//   );

// export const onHostPressContinue = async (
//   sharedCollectionActor: SharedCollectionActor,
//   hostUserIds: string[]
// ) => {
//   const hostPressContinue$ = from(sharedCollectionActor).pipe(
//     // Map and merge
//     switchMap(({ context }) => {
//       const hostEventObservables = hostUserIds
//         .map((userId) => {
//           const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
//           return context.actorRefs[actorId] as TriviaJamPlayerActor;
//         })
//         .filter((actor) => !!actor)
//         .map(
//           (actor) =>
//             fromEvent$(
//               actor,
//               'CONTINUE'
//             ) as Observable<TriviaJamSharedHostPressContinueEvent>
//         );
//       return combineLatest(hostEventObservables);
//     }),
//     filter((hostEvents) => hostEvents.length >= 1),
//     map(() => TriviaJamSharedEvents.HOST_PRESS_CONTINUE()),
//     take(1)
//   );
//   return await firstValueFrom(hostPressContinue$);
// };
