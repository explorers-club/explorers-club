import {
  GameConfig,
  TriviaJamConfigSerialized,
  useStoreSelector,
} from '@explorers-club/room';
import { TriviaJamConfigurationScreen } from '@explorers-club/trivia-jam/configuration';
import { useContext, useCallback } from 'react';
import { ClubRoomContext } from './club-room.context';
import { useClubStore } from './club-room.hooks';

export const ConfigurationScreen = () => {
  const service = useContext(ClubRoomContext);
  const store = useClubStore();

  const gameConfig = useStoreSelector(store, (state) => {
    return unwrapConfig('trivia_jam', state.configDataSerialized);
  });

  const handleSubmit = useCallback(
    (data: TriviaJamConfigSerialized) => {
      service.send({
        type: 'SET_GAME_CONFIG',
        config: { type: 'trivia_jam', data },
      });
    },
    [service]
  );

  switch (gameConfig.type) {
    case 'trivia_jam':
      return (
        <TriviaJamConfigurationScreen
          initialConfig={gameConfig.data}
          onSubmitConfig={handleSubmit}
        />
      );
    default:
      console.warn("couldn't find config screen for " + gameConfig.type);
      return null;
  }
};

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
