import {
  GameId,
  TriviaJamConfigSerialized,
  useStoreSelector,
} from '@explorers-club/room';
import { TriviaJamConfigurationScreen } from '@explorers-club/trivia-jam/configuration';
import { useSelector } from '@xstate/react';
import { FC, useCallback, useContext } from 'react';
import { AppContext } from '../../../state/app.context';
import { AuthContext } from '../../../state/auth.context';
import { GameCardComponent } from './game-card.component';
import { selectGameConfig } from '../club-tab.selectors';

interface Props {
  gameId: GameId;
}

const TRIVIA_JAM_CONFIG = {
  name: 'Trivia Jam',
  configuration: TriviaJamConfigurationScreen,
} as const;

const DIFFUSIONARY_CONFIG = {
  name: 'Diffusionary',
  configuration: TriviaJamConfigurationScreen, // todo swap for diffusionary
} as const;

const GAMES_CONFIG = {
  trivia_jam: TRIVIA_JAM_CONFIG,
  diffusionary: DIFFUSIONARY_CONFIG,
} as const;

export const GameCard: FC<Props> = ({ gameId }) => {
  const { modalActor, clubTabActor } = useContext(AppContext);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const store = useSelector(clubTabActor, (state) => state.context.store!);
  const gameConfig = useStoreSelector(store, selectGameConfig);
  const hostUserId = useStoreSelector(store, (store) => store.hostUserId);
  const { userId } = useContext(AuthContext);
  const isHost = hostUserId === userId;

  const { name, configuration } = GAMES_CONFIG[gameId];

  const handleSubmitConfig = useCallback(
    (data: TriviaJamConfigSerialized) => {
      store.send({
        type: 'SET_GAME_CONFIG',
        config: {
          type: 'trivia_jam',
          data,
        },
      });
      modalActor.send('CLOSE');
    },
    [store, modalActor]
  );

  const handlePressConfigure = useCallback(() => {
    modalActor.send({
      type: 'SHOW',
      component: (
        <TriviaJamConfigurationScreen
          initialConfig={gameConfig.data}
          onSubmitConfig={handleSubmitConfig}
        />
      ),
    });
  }, [handleSubmitConfig, gameConfig, modalActor]);

  const handlePressStart = useCallback(() => {
    clubTabActor.send('START_GAME');
  }, [clubTabActor]);

  return (
    <GameCardComponent
      name={name}
      onPressConfigure={handlePressConfigure}
      onPressStart={isHost ? handlePressStart : undefined}
    />
  );
};
