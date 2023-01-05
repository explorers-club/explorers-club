import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { TabBarActor } from '@organisms/tab-bar';
import { useSelector } from '@xstate/react';
import { FC, useCallback, useContext } from 'react';
import { NameForm } from '../../components/molecules/name-form';
import { AppContext } from '../../state/app.context';
import { ClubTabActor } from '../club';
import { LobbyTabActor } from './lobby-tab.machine';

interface Props {
  actor: LobbyTabActor;
  clubTabActor: ClubTabActor;
  tabBarActor: TabBarActor;
}

export const LobbyTabComponent: FC<Props> = ({
  actor,
  clubTabActor,
  tabBarActor,
}) => {
  const { modalActor } = useContext(AppContext);
  const rooms = useSelector(actor, (state) => state.context.rooms);

  const handleSubmitName = useCallback(
    (playerName: string) => {
      clubTabActor.send({
        type: 'CONNECT',
        clubName: playerName,
      });
      tabBarActor.send({
        type: 'NAVIGATE',
        tab: 'Club',
      });
      modalActor.send({ type: 'CLOSE' });
    },
    [tabBarActor, clubTabActor, modalActor]
  );

  const handleStartGame = useCallback(() => {
    modalActor.send({
      type: 'SHOW',
      component: <NameForm onSubmit={handleSubmitName} />,
    });
  }, [modalActor, handleSubmitName]);

  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex css={{ p: '$3' }} direction="column" gap="3">
          <Heading>Open Rooms</Heading>
          {rooms && rooms.length ? (
            rooms.map((room) => (
              <Card
                key={room.roomId}
                css={{ p: '$2' }}
                variant="interactive"
                onClick={() => {
                  clubTabActor.send({
                    type: 'CONNECT',
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    clubName: room.metadata!.clubName,
                  });
                  tabBarActor.send({
                    type: 'NAVIGATE',
                    tab: 'Club',
                  });
                }}
              >
                <Text>{room.metadata?.clubName}'s Explorers Club</Text>
              </Card>
            ))
          ) : (
            <Text>There are no open club rooms.</Text>
          )}
          <Button color="primary" size="3" onClick={handleStartGame}>
            Start New Room
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
