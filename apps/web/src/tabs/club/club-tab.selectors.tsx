import {
  ClubPlayerSerialized,
  ClubStateSerialized,
} from '@explorers-club/room';
import {
  CodebreakersConfig,
  CodebreakersConfigSchema,
  DiffusionaryConfig,
  DiffusionaryConfigSchema,
  LittleVigilanteConfig,
  LittleVigilanteConfigSchema,
  TriviaJamConfig,
  TriviaJamConfigSchema,
} from '@explorers-club/schema';
import { createSelector } from 'reselect';
import { LittleVigilanteGameInfoScreen } from '@explorers-club/little-vigilante/meta/components';
import { CodebreakersGameInfoScreen } from '@explorers-club/codebreakers/meta/components';
import { DiffusionaryGameInfoScreen } from '@explorers-club/diffusionary/meta/components';
import { TriviaJamGameInfoScreen } from '@explorers-club/trivia-jam/meta/components';

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

const selectSelectedGameConfigJSON = (state: ClubStateSerialized) => {
  const gameConfigSerialized = state.gameConfigsSerialized[state.selectedGame];
  if (gameConfigSerialized) {
    return JSON.parse(gameConfigSerialized);
  }
  return {};
};

const selectSelectedGame = (state: ClubStateSerialized) => state.selectedGame;

export const selectGameConfig = createSelector(
  selectSelectedGameConfigJSON,
  selectSelectedGame,
  (json, selectedGame) => {
    switch (selectedGame) {
      case 'little_vigilante':
        return LittleVigilanteConfigSchema.parse(json);
      case 'diffusionary':
        return DiffusionaryConfigSchema.parse(json);
      case 'codebreakers':
        return CodebreakersConfigSchema.parse(json);
      case 'trivia_jam':
        return TriviaJamConfigSchema.parse(json);
      default:
        throw new Error(`couldn't prase config for ${selectedGame}`);
    }
  }
);

export const selectGameInfoComponent = createSelector(
  selectSelectedGame,
  (selectedGame) => {
    switch (selectedGame) {
      case 'little_vigilante':
        return <LittleVigilanteGameInfoScreen />;
      case 'codebreakers':
        return <CodebreakersGameInfoScreen />;
      case 'diffusionary':
        return <DiffusionaryGameInfoScreen />;
      case 'trivia_jam':
        return <TriviaJamGameInfoScreen />;
      default:
        return null;
    }
  }
);
