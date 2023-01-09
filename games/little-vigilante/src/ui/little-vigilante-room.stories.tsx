import {
  LittleVigilanteStateSerialized,
  LittleVigilanteStore,
} from '@explorers-club/room';
import { ComponentMeta, Story } from '@storybook/react';
import { LittleVigilanteContext } from '../state/little-vigilante.context';
import { LittleVigilanteRoomComponent } from './little-vigilante-room.component';

export default {
  component: LittleVigilanteRoomComponent,
} as ComponentMeta<typeof LittleVigilanteRoomComponent>;

const createMockStore = (state: LittleVigilanteStateSerialized) => {
  const store: LittleVigilanteStore = {
    id: 'foo',
    subscribe(cb) {
      return () => {
        // no-op
      };
    },
    getSnapshot() {
      return state;
    },
    send(command) {
      // no-op
    },
  };
  return store;
};

const Template: Story<{
  state: LittleVigilanteStateSerialized;
  myUserId: string;
}> = (args) => {
  const { state, myUserId } = args;
  const store = createMockStore(state);

  return (
    <LittleVigilanteContext.Provider value={{ store, myUserId }}>
      <LittleVigilanteRoomComponent />
    </LittleVigilanteContext.Provider>
  );
};

const players = {
  foo: {
    score: 0,
    name: 'Bar',
    connected: true,
    userId: 'foo',
    slotNumber: 1,
  },
  bar: {
    score: 0,
    name: 'Bar',
    connected: true,
    userId: 'bar',
    slotNumber: 2,
  },
  buz: {
    score: 0,
    name: 'Buz',
    connected: true,
    userId: 'buz',
    slotNumber: 3,
  },
  lightYear: {
    score: 0,
    name: 'Lightyear',
    connected: true,
    userId: 'lightyear',
    slotNumber: 4,
  },
};

export const PlayingAwaitingNext = Template.bind({});

PlayingAwaitingNext.args = {
  myUserId: 'bar',
  state: {
    currentRound: 1,
    currentStates: ['Playing', 'Playing.AwaitingNext'],
    players,
  },
};

export const PlayingNightPhase = Template.bind({});

PlayingNightPhase.args = {
  myUserId: 'foo',
  state: {
    currentRound: 1,
    currentStates: ['Playing', 'Playing.NightPhase'],
    players,
  },
};

export const PlayingDiscussionPhase = Template.bind({});

PlayingDiscussionPhase.args = {
  myUserId: 'foo',
  state: {
    currentRound: 1,
    currentStates: ['Playing', 'Playing.DiscussionPhase'],
    players,
  },
};

export const PlayingReveal = Template.bind({});

PlayingReveal.args = {
  myUserId: 'foo',
  state: {
    currentRound: 1,
    currentStates: ['Playing', 'Playing.Reveal'],
    players,
  },
};

export const GameOver = Template.bind({});

GameOver.args = {
  myUserId: 'foo',
  state: {
    currentRound: 1,
    currentStates: ['GameOver'],
    players,
  },
};