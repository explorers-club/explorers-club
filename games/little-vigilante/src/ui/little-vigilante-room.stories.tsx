import {
  createRoomStore,
  LittleVigilanteStateSerialized,
  LittleVigilanteStore,
} from '@explorers-club/room';
import { useEffect } from '@storybook/addons';
import { ComponentMeta, Story } from '@storybook/react';
import * as Colyseus from 'colyseus.js';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LittleVigilanteContext } from '../state/little-vigilante.context';
import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';
import { OnCreateOptions } from '../server/LittleVigilanteRoom';
import { withQueryClient } from '@storybook-decorators/QueryClientDecorator';
import { LittleVigilanteState } from '../../../../libs/schema/@types/generated/LittleVigilanteState';

export default {
  component: LittleVigilanteRoomComponent,
  decorators: [withQueryClient],
} as ComponentMeta<typeof LittleVigilanteRoomComponent>;

// const createMockStore = (state: LittleVigilanteStateSerialized) => {
//   const store: LittleVigilanteStore = {
//     id: 'foo',
//     subscribe(cb) {
//       return () => {
//         // no-op
//       };
//     },
//     getSnapshot() {
//       return state;
//     },
//     send(command) {
//       // no-op
//     },
//   };
//   return store;
// };

const Template: Story<OnCreateOptions & { myUserId: string }> = (args) => {
  const { roomId, playerInfo, myUserId } = args;
  const [colyseusClient] = useState(new Colyseus.Client('ws://localhost:2567'));

  const query = useQuery(['room'], async () => {
    const room = await colyseusClient.create<LittleVigilanteState>(
      'little_vigilante',
      {
        roomId,
        playerInfo,
      }
    );
    await new Promise((resolve) => room.onStateChange.once(resolve));

    const store = createRoomStore(room);
    return store;
  });
  const store = query.data;

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
  roomId: 'little_vigilante-test',
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

Default.play = async (context) => {
  const { playerInfo, myUserId } = context.args;

  playerInfo.forEach(({ name, userId }) => {
    if (userId !== myUserId) {
      console.log(userId);
    }
  });
};

// export const PlayingAwaitingNext = Template.bind({});

// PlayingAwaitingNext.args = {
//   myUserId: 'bar',
//   state: {
//     currentRound: 1,
//     currentStates: ['Playing', 'Playing.AwaitingNext'],
//     players,
//   },
// };

// export const PlayingNightPhase = Template.bind({});

// PlayingNightPhase.args = {
//   myUserId: 'foo',
//   state: {
//     currentRound: 1,
//     currentStates: ['Playing', 'Playing.Round', 'Playing.Round.NightPhase'],
//     players,
//   },
// };

// export const PlayingDiscussionPhase = Template.bind({});

// PlayingDiscussionPhase.args = {
//   myUserId: 'foo',
//   state: {
//     currentRound: 1,
//     currentStates: [
//       'Playing',
//       'Playing.Round',
//       'Playing.Round.DiscussionPhase',
//     ],
//     players,
//   },
// };

// export const PlayingReveal = Template.bind({});

// PlayingReveal.args = {
//   myUserId: 'foo',
//   state: {
//     currentRound: 1,
//     currentStates: ['Playing', 'Playing.Round', 'Playing.Round.Reveal'],
//     players,
//   },
// };

// export const PlayingVoting = Template.bind({});

// PlayingVoting.args = {
//   myUserId: 'foo',
//   state: {
//     currentRound: 1,
//     currentStates: ['Playing', 'Playing.Round', 'Playing.Round.Voting'],
//     players,
//   },
// };

// export const GameOver = Template.bind({});

// GameOver.args = {
//   myUserId: 'foo',
//   state: {
//     currentRound: 1,
//     currentStates: ['GameOver'],
//     players,
//   },
// };
