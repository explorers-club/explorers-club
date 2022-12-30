import {
  TriviaJamConfigSerialized,
  useStoreSelector,
} from '@explorers-club/room';
import { TriviaJamConfigurationScreen } from '@explorers-club/trivia-jam/configuration';
import { useCallback, useContext } from 'react';
import { ClubRoomContext } from './club-room.context';
import { useClubStore } from './club-room.hooks';
import { selectGameConfig } from './club-room.selectors';

export const ConfigurationScreen = () => {
  const service = useContext(ClubRoomContext);
  const store = useClubStore();

  const gameConfig = useStoreSelector(store, selectGameConfig);

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
