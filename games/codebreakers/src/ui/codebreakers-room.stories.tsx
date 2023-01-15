import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Grid } from '@atoms/Grid';
import { Heading } from '@atoms/Heading';
import { CodebreakersStore, createRoomStore } from '@explorers-club/room';
import { CodebreakersState } from '@explorers-club/schema-types/CodebreakersState';
import { generateRandomString } from '@explorers-club/utils';
import { ComponentMeta, Story } from '@storybook/react';
import * as Colyseus from 'colyseus.js';
import { Room } from 'colyseus.js';
import { FC, useEffect, useState } from 'react';
import { CodebreakersContext } from '../state/codebreakers.context';
import { CodebreakersRoomComponent } from './codebreakers-room.component';

export default {
  component: CodebreakersRoomComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CodebreakersRoomComponent>;

const RoomWrapper: FC<{ roomId: string; myUserId: string }> = (props) => {
  const { roomId, myUserId } = props;
  const [store, setStore] = useState<CodebreakersStore | null>(null);

  useEffect(() => {
    joinAndCreateStore(roomId, myUserId).then(setStore).catch(console.error);
  }, [roomId, myUserId, setStore]);

  if (!store) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <CodebreakersContext.Provider value={{ store, myUserId }}>
      <CodebreakersRoomComponent />
    </CodebreakersContext.Provider>
  );
};

const Template: Story<{ numPlayers: number }> = (args) => {
  const [initialized, setInitialized] = useState(false);
  const [roomId] = useState(`codebreakers-${generateRandomString()}`);
  const [playerInfo] = useState(fullPlayerInfo.slice(0, args.numPlayers));
  // const { roomId, playerInfo } = args;

  useEffect(() => {
    (async () => {
      const colyseusClient = new Colyseus.Client('ws://localhost:2567');
      let room: Room<CodebreakersState>;
      try {
        room = await colyseusClient.create<CodebreakersState>('codebreakers', {
          roomId,
          playerInfo,
        });
      } catch (ex) {
        console.error(ex);
        return;
      }
      await new Promise((resolve) => room.onStateChange.once(resolve));
      console.log(room);
      setInitialized(true);
    })();
  }, [setInitialized, playerInfo, roomId]);

  return initialized ? (
    <Grid
      css={{
        height: '100vh',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridAutoRows: 'minmax(0, 1fr)',
        overflow: 'auto',
      }}
    >
      {playerInfo.map(({ userId, name }, index) => (
        <Box
          key={userId}
          css={{ background: '$neutral1', width: '100%', overflowY: 'scroll' }}
        >
          <Heading css={{ mt: '$2', textAlign: 'center' }}>{name}</Heading>
          <RoomWrapper roomId={roomId} myUserId={userId} />
        </Box>
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

const joinAndCreateStore = async (roomId: string, userId: string) => {
  const client = new Colyseus.Client('ws://localhost:2567');
  const room = await client.joinById<CodebreakersState>(roomId, {
    userId,
  });
  await new Promise((resolve) => {
    room.onStateChange.once(resolve);
  });
  const store = createRoomStore(room);
  return store;
};
