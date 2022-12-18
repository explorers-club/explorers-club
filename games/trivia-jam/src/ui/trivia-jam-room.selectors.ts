import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';

export const selectAllPlayersConnected = (state: TriviaJamState) => {
  const unconnectedPlayers = Array.from(state.players.values()).filter(
    (player) => !player.connected
  );

  return unconnectedPlayers.length === 0;
};