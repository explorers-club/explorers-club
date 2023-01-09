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

export const Initial = Template.bind({});

Initial.args = {
  myUserId: "bar",
  state: {
    currentRound: 1,
    currentStates: ['Initial'],
    players: {
      bar: {
        score: 0,
        name: 'Jon',
        connected: false,
        userId: 'bar',
        slotNumber: 1,
      },
    },
  },
};

export const Playing = Template.bind({});

Playing.args = {
  myUserId: "foo",
  state: {
    currentRound: 1,
    currentStates: ['Playing'],
    players: {
      bar: {
        score: 0,
        name: 'Jon',
        connected: false,
        userId: 'bar',
        slotNumber: 1,
      },
    },
  },
};
