import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { CodebreakersConfigurationScreen } from '@explorers-club/codebreakers/meta/components';
import { DiffusionaryConfigurationScreen } from '@explorers-club/diffusionary/meta/components';
import { LittleVigilanteConfigurationScreen } from '@explorers-club/little-vigilante/meta/components';
import { GameConfig } from '@explorers-club/room';
import { TriviaJamConfigurationScreen } from '@explorers-club/trivia-jam/meta/components';
import { GearIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { FC, useCallback, useContext, useMemo } from 'react';
import { CloseableModal } from '../../../components/organisms/modal';
import { AppContext } from '../../../state/app.context';
import { useClubStoreSelector, useIsHost, useSend } from '../club-tab.hooks';
import {
  selectGameConfig,
  selectGameInfoComponent,
} from '../club-tab.selectors';

interface Props {
  gameId: string;
  displayName: string;
  coverImageUrl: string;
  minPlayers: number;
  maxPlayers: number;
}

export const GameCardComponent: FC<Props> = ({
  displayName,
  coverImageUrl,
  minPlayers,
  maxPlayers,
}) => {
  const { modalActor } = useContext(AppContext);
  const send = useSend();
  const gameConfig = useClubStoreSelector(selectGameConfig);
  const GameInfoScreenComponent = useClubStoreSelector(selectGameInfoComponent);
  const isHost = useIsHost();

  // useClubStoreSelector((state) => state);
  const handlePressInfo = useCallback(() => {
    if (GameInfoScreenComponent) {
      modalActor.send({
        type: 'SHOW',
        component: <CloseableModal component={GameInfoScreenComponent} />,
      });
    }
  }, [modalActor, GameInfoScreenComponent]);

  const handleSubmitConfig = useCallback(
    (config: GameConfig) => {
      send({
        type: 'SET_GAME_CONFIG',
        config,
      });
      modalActor.send('CLOSE');
    },
    [send, modalActor]
  );

  const Component = useMemo(
    () => () => {
      switch (gameConfig.gameId) {
        case 'little_vigilante':
          return (
            <LittleVigilanteConfigurationScreen
              initialConfig={gameConfig}
              onSubmitConfig={handleSubmitConfig}
            />
          );
        case 'diffusionary':
          return (
            <DiffusionaryConfigurationScreen
              initialConfig={gameConfig}
              onSubmitConfig={handleSubmitConfig}
            />
          );
        case 'codebreakers':
          return (
            <CodebreakersConfigurationScreen
              initialConfig={gameConfig}
              onSubmitConfig={handleSubmitConfig}
            />
          );
        case 'trivia_jam':
          return (
            <TriviaJamConfigurationScreen
              initialConfig={gameConfig}
              onSubmitConfig={handleSubmitConfig}
            />
          );
        default:
          throw new Error(`no configuration screen defined`);
      }
    },
    [gameConfig, handleSubmitConfig]
  );

  const handlePressConfigure = useCallback(() => {
    modalActor.send({
      type: 'SHOW',
      component: <Component />,
    });
  }, [Component, modalActor]);

  return (
    <Card
      css={{
        aspectRatio: 1,
        backgroundSize: 'contain',
        backgroundImage: `url(${coverImageUrl})`,
      }}
    >
      <Box
        css={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          p: '$4',
          pt: '$8',
          background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
        }}
      >
        <Flex justify="between">
          <Box>
            <Heading size="2">{displayName}</Heading>
            <Caption size="2">
              {minPlayers} - {maxPlayers} players
            </Caption>
          </Box>
          <Box>
            {GameInfoScreenComponent && (
              <IconButton size="3" onClick={handlePressInfo}>
                <InfoCircledIcon />
              </IconButton>
            )}
            {isHost && (
              <IconButton size="3" onClick={handlePressConfigure}>
                <GearIcon />
              </IconButton>
            )}
          </Box>
        </Flex>
      </Box>
    </Card>
  );
};
