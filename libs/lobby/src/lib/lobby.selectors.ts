import { createSelector } from 'reselect';
import {
  ActorType,
  createActorByIdSelector,
  createActorByTypeSelector,
  getActorId,
} from '@explorers-club/actor';
import { LobbyPlayerActor } from './lobby-player.machine';
import { LobbySharedActor } from './lobby-shared.machine';

export const selectLobbyPlayerActors =
  createActorByTypeSelector<LobbyPlayerActor>(ActorType.LOBBY_PLAYER_ACTOR);

export const selectLobbySharedActor = createSelector(
  createActorByTypeSelector<LobbySharedActor>(ActorType.LOBBY_SHARED_ACTOR),
  (actors) => actors[0]
);

export const createPlayerActorByUserIdSelector = (userId: string) =>
  createActorByIdSelector<LobbyPlayerActor>(
    getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId)
  );
