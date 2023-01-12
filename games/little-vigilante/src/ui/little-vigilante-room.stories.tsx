import { createRoomStore, LittleVigilanteStore } from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { generateRandomString } from '@explorers-club/utils';
import { useEffect } from '@storybook/addons';
import { ComponentMeta, Story } from '@storybook/react';
import * as Colyseus from 'colyseus.js';
import { Room } from 'colyseus.js';
import { useState } from 'react';
import { OnCreateOptions } from '../server/LittleVigilanteRoom';
import { LittleVigilanteContext } from '../state/little-vigilante.context';
import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';

export default {
  component: LittleVigilanteRoomComponent,
} as ComponentMeta<typeof LittleVigilanteRoomComponent>;

const Template: Story<OnCreateOptions & { myUserId: string }> = (args) => {
  const { roomId, myUserId } = args;
  const [store, setStore] = useState<LittleVigilanteStore | null>(null);

  useEffect(() => {
    joinAndCreateStore(roomId, myUserId).then(setStore).catch(console.error);
  }, [roomId, myUserId, setStore]);

  if (!store) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <LittleVigilanteContext.Provider value={{ store, myUserId }}>
      <LittleVigilanteRoomComponent />
    </LittleVigilanteContext.Provider>
  );
};

export const Default = Template.bind({});

Default.args = {
  myUserId: 'foo',
  roomId: `little_vigilante-${generateRandomString()}`,
  playerInfo: [
    {
      name: 'Foo',
      userId: 'foo',
    },
    {
      name: 'Bar',
      userId: 'bar',
    },
    {
      name: 'Buz',
      userId: 'buz',
    },
    {
      name: 'Lightyear',
      userId: 'lightyear',
    },
  ],
};

const joinAndCreateStore = async (roomId: string, userId: string) => {
  const client = new Colyseus.Client('ws://localhost:2567');
  const room = await client.joinById<LittleVigilanteState>(roomId, {
    userId,
  });
  await new Promise((resolve) => {
    room.onStateChange.once(resolve);
  });
  const store = createRoomStore(room);
  return store;
};

Default.play = async (context) => {
  const { roomId, playerInfo, myUserId } = context.args;

  const colyseusClient = new Colyseus.Client('ws://localhost:2567');
  let room: Room<LittleVigilanteState>;
  try {
    room = await colyseusClient.create<LittleVigilanteState>(
      'little_vigilante',
      {
        roomId,
        playerInfo,
      }
    );
  } catch (ex) {
    console.error(ex);
    return;
  }
  await new Promise((resolve) => room.onStateChange.once(resolve));

  // Mimic joining all the other player clients
  try {
    await Promise.all(
      playerInfo
        .filter(({ userId }) => userId !== myUserId)
        .map(({ userId }) => joinAndCreateStore(roomId, userId))
    );
  } catch (ex) {
    console.error(ex);
    return;
  }
};
