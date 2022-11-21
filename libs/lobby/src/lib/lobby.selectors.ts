import { ActorType, createActorByTypeSelector } from '@explorers-club/actor';
import { createSelector } from 'reselect';
import { LobbyPlayerActor } from './lobby-player.machine';
import { LobbyServerActor } from './lobby-server.machine';

export const selectLobbyPlayerActors =
  createActorByTypeSelector<LobbyPlayerActor>(ActorType.LOBBY_PLAYER_ACTOR);

export const selectLobbyServerActor = createSelector(
  createActorByTypeSelector<LobbyServerActor>(ActorType.LOBBY_SERVER_ACTOR),
  (actors) => actors[0]
);
