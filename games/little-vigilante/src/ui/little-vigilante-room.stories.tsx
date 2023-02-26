import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Grid } from '@atoms/Grid';
import { Heading } from '@atoms/Heading';
import {
  createRoomStore,
  LittleVigilanteServerEvent,
  LittleVigilanteStore,
} from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { generateRandomString } from '@explorers-club/utils';
import { ComponentMeta, Story } from '@storybook/react';
import * as Colyseus from 'colyseus.js';
import { Room } from 'colyseus.js';
import { FC, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { Flex } from '../../../../libs/components/src/atoms/Flex';
import { OnCreateOptions } from '../server/LittleVigilanteRoom';
import { LittleVigilanteContext } from '../state/little-vigilante.context';
import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';
import { ChatServiceProvider } from './organisms/chat.context';

export default {
  component: LittleVigilanteRoomComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LittleVigilanteRoomComponent>;

const RoomWrapper: FC<{ roomId: string; myUserId: string }> = (props) => {
  const { roomId, myUserId } = props;
  const [store, setStore] = useState<LittleVigilanteStore | null>(null);
  const [event$] = useState<Subject<LittleVigilanteServerEvent>>(new Subject());

  useEffect(() => {
    joinAndCreateStore(roomId, myUserId, event$)
      .then(setStore)
      .catch(console.error);
  }, [roomId, myUserId, setStore, event$]);

  if (!store) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <LittleVigilanteContext.Provider
      value={{ store, myUserId, event$, gameId: roomId }}
    >
      <ChatServiceProvider>
        <Flex direction="column" css={{ width: '100%', minHeight: '100%' }}>
          <LittleVigilanteRoomComponent />
        </Flex>
      </ChatServiceProvider>
    </LittleVigilanteContext.Provider>
  );
};

const Template: Story<{
  numPlayers: number;
  votingTimeSeconds?: number;
  discussionTimeSeconds?: number;
}> = ({ numPlayers, votingTimeSeconds = 25, discussionTimeSeconds = 60 }) => {
  const [initialized, setInitialized] = useState(false);
  const [roomId] = useState(`little_vigilante-${generateRandomString()}`);
  const [playerInfo] = useState(fullPlayerInfo.slice(0, numPlayers));

  useEffect(() => {
    (async () => {
      const colyseusClient = new Colyseus.Client('ws://localhost:2567');
      let room: Room<LittleVigilanteState>;
      const options: OnCreateOptions = {
        roomId,
        playerInfo,
        votingTimeSeconds,
        discussionTimeSeconds,
        roundsToPlay: 3,
        rolesToExclude: ['butler'],
      };
      try {
        room = await colyseusClient.create<LittleVigilanteState>(
          'little_vigilante',
          options
        );
        room.onMessage('*', (event: LittleVigilanteServerEvent) => {
          // just a no-op so we don't get warnings logs
        });
      } catch (ex) {
        console.error(ex);
        return;
      }
      await new Promise((resolve) => room.onStateChange.once(resolve));
      setInitialized(true);
    })();
  }, [
    setInitialized,
    playerInfo,
    roomId,
    votingTimeSeconds,
    discussionTimeSeconds,
  ]);

  return initialized ? (
    <Grid
      css={{
        // height: '100vh',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridAutoRows: '700px',
      }}
    >
      {playerInfo.map(({ userId, name }, index) => (
        <Flex
          key={userId}
          direction="column"
          css={{
            background: '$neutral1',
            width: '100%',
            // overflow: 'auto',
          }}
        >
          {/* <Heading css={{ mt: '$2', textAlign: 'center' }}>{name}</Heading> */}
          <RoomWrapper roomId={roomId} myUserId={userId} />
        </Flex>
      ))}
    </Grid>
  ) : (
    <Card css={{ p: '$3' }}>
      <Heading>Loading...</Heading>
    </Card>
  );
};

const fullPlayerInfo = [
  {
    name: 'Alice',
    userId: 'alice123',
  },
  {
    name: 'Bob',
    userId: 'bob123',
  },
  {
    name: 'Charlie',
    userId: 'charlie123',
  },
  {
    name: 'Dave',
    userId: 'dave123',
  },
  {
    name: 'Eve',
    userId: 'eve123',
  },
  {
    name: 'Frank',
    userId: 'frank123',
  },
  {
    name: 'Grace',
    userId: 'grace123',
  },
  {
    name: 'Heidi',
    userId: 'heidi123',
  },
];

export const FourPlayer = Template.bind({});
FourPlayer.args = {
  numPlayers: 4,
};

export const FivePlayer = Template.bind({});
FivePlayer.args = {
  numPlayers: 5,
};

export const SixPlayer = Template.bind({});
SixPlayer.args = {
  numPlayers: 6,
};

export const SevenPlayer = Template.bind({});
SevenPlayer.args = {
  numPlayers: 7,
};

export const EightPlayer = Template.bind({});
EightPlayer.args = {
  numPlayers: 8,
};

const joinAndCreateStore = async (
  roomId: string,
  userId: string,
  eventSubject$: Subject<LittleVigilanteServerEvent>
) => {
  const client = new Colyseus.Client('ws://localhost:2567');
  const room = await client.joinById<LittleVigilanteState>(roomId, {
    userId,
  });
  room.onMessage('*', (type, event: LittleVigilanteServerEvent) => {
    eventSubject$.next(event);
  });
  await new Promise((resolve) => {
    room.onStateChange.once(resolve);
  });
  const store = createRoomStore(room);
  return store;
};
