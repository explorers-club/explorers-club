import { Meta, Story } from '@storybook/react';
import { rolesByPlayerCount } from '../../meta/little-vigilante.constants';
import {
  LittleVigilanteMockState,
  withLittleVigilanteContext,
} from '../../test/withLittleVigilanteContext';
import { DiscussionPhaseScreenComponent } from './discussion-phase-screen.component';

export default {
  component: DiscussionPhaseScreenComponent,
  decorators: [withLittleVigilanteContext],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Primary: Story<LittleVigilanteMockState> = () => {
  return <DiscussionPhaseScreenComponent />;
};

const players = {
  alice123: {
    name: 'Alice',
    score: 0,
    userId: 'alice123',
    connected: true,
    slotNumber: 1,
    currentRoundRoleTargets: {
      bob123: 'politician',
      eve123: 'conspirator',
    },
  },
  bob123: {
    name: 'Bob',
    score: 0,
    userId: 'bob123',
    connected: true,
    slotNumber: 2,
    currentRoundRoleTargets: {},
  },
  charlie123: {
    name: 'Charlie',
    userId: 'charlie123',
    score: 0,
    connected: true,
    slotNumber: 3,
    currentRoundRoleTargets: {
      dave123: 'vigilante',
      bob123: 'politician',
    },
  },
  dave123: {
    name: 'Dave',
    userId: 'dave123',
    score: 0,
    connected: true,
    slotNumber: 4,
    currentRoundRoleTargets: {
      alice123: 'student',
      bob123: 'politician',
    },
  },
  eve123: {
    name: 'Eve',
    userId: 'eve123',
    score: 0,
    connected: true,
    slotNumber: 5,
    currentRoundRoleTargets: {
      dave123: 'vigilante',
      bob123: 'politician',
    },
  },
  frank123: {
    name: 'Frank',
    userId: 'frank123',
    score: 0,
    connected: true,
    slotNumber: 6,
    currentRoundRoleTargets: {
      bob123: 'politician',
    },
  },
};

Primary.args = {
  myUserId: 'alice123',
  state: {
    timeRemaining: 57,
    roles: Array.from(rolesByPlayerCount[Object.values(players).length]),
    players,
    currentStates: ['Playing.Round.DiscussionPhase.Idle'],
  },
};
