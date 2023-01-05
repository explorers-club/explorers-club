import {
  ClubPlayerSerialized,
  ClubStateSerialized,
  GameConfig,
  TriviaJamConfigSerialized,
} from '@explorers-club/room';

export const selectHostUserId = (state: ClubStateSerialized) =>
  state.hostUserId;

export const selectGameRoomId = (state: ClubStateSerialized) =>
  state.gameRoomId;

export const selectPlayerBySlotNumber = (state: ClubStateSerialized) => {
  const result: Record<number, ClubPlayerSerialized> = {};
  Object.values(state.players).forEach((player) => {
    result[player.slotNumber] = player;
  });

  return result;
};

export const selectGameConfig = (state: ClubStateSerialized) =>
  unwrapConfig('trivia_jam', state.configDataSerialized);

const unwrapConfig = <K extends 'trivia_jam'>(
  gameId: K,
  configDataSerialized: string
): GameConfig => {
  const json = JSON.parse(configDataSerialized);

  return {
    type: gameId,
    data: json as TriviaJamConfigSerialized,
  };
};
