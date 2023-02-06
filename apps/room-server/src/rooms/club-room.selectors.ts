import { ClubStateSerialized } from '@explorers-club/room';
import {
  CodebreakersConfigSchema,
  DiffusionaryConfigSchema,
  LittleVigilanteConfigSchema,
  TriviaJamConfigSchema,
} from '@explorers-club/schema';

export const selectAllRequirements = (state: ClubStateSerialized) => {
  return true;
};

export const selectOpenSlots = (state: ClubStateSerialized) => {
  return [1, 2];
};

export const selectExistingNames = (state: ClubStateSerialized) => {
  return Object.entries(state.players).map(([_, player]) => player.name);
};

export const selectCurrentGameRoomId = (state: ClubStateSerialized) => {
  const config = selectGameConfig(state);
  return `${config.gameId}-${state.clubName}`;
};

export const selectGameConfig = (state: ClubStateSerialized) => {
  const jsonStr = state.gameConfigsSerialized[state.selectedGame] || '{}';
  const json = JSON.parse(jsonStr);
  switch (state.selectedGame) {
    case 'little_vigilante':
      return LittleVigilanteConfigSchema.parse(json);
    case 'trivia_jam':
      return TriviaJamConfigSchema.parse(json);
    case 'diffusionary':
      return DiffusionaryConfigSchema.parse(json);
    case 'codebreakers':
      return CodebreakersConfigSchema.parse(json);
    default:
      throw new Error("couldn't find game config for selected game");
  }
};

// export const selectMinPlayers = (state: ClubStateSerialized) => {
//   const gameConfig = selectGameConfig(state);
//   return gameConfig.minPlayers;
// };

// export const selectMaxPlayers = (state: ClubStateSerialized) => {
//   const gameConfig = selectGameConfig(state);
//   return gameConfig.maxPlayers;
// };
