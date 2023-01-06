import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import {
  ClubStore, useStoreSelector
} from '@explorers-club/room';
import { useSelector } from '@xstate/react';
import { FC, useCallback, useContext, useLayoutEffect } from 'react';
import { NameForm } from '../../components/molecules/name-form';
import { AppContext } from '../../state/app.context';
import { colorBySlotNumber } from './club-tab.constants';
import {
  selectGameConfig,
  selectPlayerBySlotNumber
} from './club-tab.selectors';
import { GameCarousel } from './components/game-carousel.component';

interface Props {
  store: ClubStore;
}

export const ClubTabComponent: FC<Props> = ({ store }) => {
  const { modalActor, clubTabActor } = useContext(AppContext);
  const hostUserId = useStoreSelector(store, (store) => store.hostUserId);
  const playersBySlotNumber = useStoreSelector(store, selectPlayerBySlotNumber);
  const gameConfig = useStoreSelector(store, selectGameConfig);
  const { maxPlayers } = gameConfig.data;
  const needsNameInput = useSelector(clubTabActor, (state) =>
    state.matches('Room.Connected.EnteringName')
  );

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

  return (
    <Flex css={{ p: '$3' }} direction="column" gap="2">
      <Card>
        <GameCarousel />
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
  );
};
