import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { Text } from '@atoms/Text';
import {
  ClubStore,
  TriviaJamConfigSerialized,
  useStoreSelector,
} from '@explorers-club/room';
import { TriviaJamConfigurationScreen } from '@explorers-club/trivia-jam/configuration';
import { GearIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
import { FC, useCallback, useContext, useLayoutEffect } from 'react';
import { NameForm } from '../../components/molecules/name-form';
import { AppContext } from '../../state/app.context';
import { AuthContext } from '../../state/auth.context';
import { colorBySlotNumber } from './club-tab.constants';
import {
  selectGameConfig,
  selectPlayerBySlotNumber,
} from './club-tab.selectors';
import { GameCarousel } from './components/game-carousel.component';

interface Props {
  store: ClubStore;
}

export const ClubTabComponent: FC<Props> = ({ store }) => {
  const { modalActor, clubTabActor } = useContext(AppContext);
  const gameRoomId = useStoreSelector(store, (store) => store.gameRoomId);
  const hostUserId = useStoreSelector(store, (store) => store.hostUserId);
  const playersBySlotNumber = useStoreSelector(store, selectPlayerBySlotNumber);
  const gameConfig = useStoreSelector(store, selectGameConfig);
  const { maxPlayers } = gameConfig.data;
  const needsNameInput = useSelector(clubTabActor, (state) =>
    state.matches('Room.Connected.EnteringName')
  );
  const { userId } = useContext(AuthContext);
  const isHost = hostUserId === userId;

  const onSubmitName = useCallback(
    (playerName: string) => {
      clubTabActor.send({ type: 'ENTER_NAME', playerName });
      modalActor.send('CLOSE');
    },
    [clubTabActor, modalActor]
  );

  useLayoutEffect(() => {
    if (needsNameInput) {
      modalActor.send({
        type: 'SHOW',
        component: <NameForm onSubmit={onSubmitName} />,
      });
    }
  }, [modalActor, onSubmitName, needsNameInput]);

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

  return !gameRoomId ? (
    <Flex css={{ p: '$3' }} direction="column" gap="2">
      <Card>
        <GameCarousel />
        <Box css={{ p: '$3' }}>
          {isHost && (
            <Flex gap="2">
              <Button
                size="3"
                color="primary"
                onClick={handlePressStart}
                css={{ flex: '1' }}
              >
                Start
              </Button>
              <IconButton size="3" onClick={handlePressConfigure}>
                <GearIcon />
              </IconButton>
            </Flex>
          )}
        </Box>
      </Card>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          {Array(maxPlayers)
            .fill(0)
            .map((_, i) => {
              const slotNumber = i + 1;
              const player = playersBySlotNumber[i + 1];

              const isEmpty = !player?.name;
              const name = !isEmpty ? player.name : 'Empty';
              const userId = player?.userId;
              const color = colorBySlotNumber[slotNumber];

              return (
                <Flex
                  key={i}
                  align="center"
                  gap="2"
                  css={{ backgroundColor: '$panel2', p: '$3' }}
                >
                  <Avatar
                    size="3"
                    variant={color}
                    fallback={`P${slotNumber}`}
                  />
                  <Flex direction="column">
                    {player?.name ? (
                      <Heading size="1">{name}</Heading>
                    ) : (
                      <Caption size="2">{name}</Caption>
                    )}
                    {userId === hostUserId && <Badge>Host</Badge>}
                  </Flex>
                </Flex>
              );
            })}
        </Flex>
      </Card>
    </Flex>
  ) : (
    <InGame />
  );
};

const InGame = () => {
  const { clubTabActor } = useContext(AppContext);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const store = useSelector(clubTabActor, (state) => state.context.store!);
  const selectedGame = useStoreSelector(store, (state) => state.selectedGame);

  return (
    <Flex css={{ p: '$3' }} direction="column" gap="2">
      <Card css={{ p: '$3' }}>
        <Text>Current playing {selectedGame}</Text>
      </Card>
    </Flex>
  );
};
