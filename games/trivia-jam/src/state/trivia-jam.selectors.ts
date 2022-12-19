import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';

export const selectAllPlayersConnected = (state: TriviaJamState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0;
};

export const selectHostUserId = (state: TriviaJamState) => {
  return state.hostUserId;
};

export const selectPlayers = (state: TriviaJamState) => {
  return Array.from(state.players.values());
};
