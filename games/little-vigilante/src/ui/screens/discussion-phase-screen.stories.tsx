import { Box } from '@atoms/Box';
import { Meta } from '@storybook/react';
import { rolesByPlayerCount } from '../../meta/little-vigilante.constants';
import {
  LittleVigilanteStory,
  withLittleVigilanteContext,
} from '../../test/withLittleVigilanteContext';
import { DiscussionPhaseScreenComponent } from './discussion-phase-screen.component';

export default {
  component: DiscussionPhaseScreenComponent,
  decorators: [withLittleVigilanteContext],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} as Meta;

export const Primary: LittleVigilanteStory = () => {
  return (
    <Box css={{ height: '100vh' }}>
      <DiscussionPhaseScreenComponent />
    </Box>
  );
};

const players = {
  alice123: {
    name: 'Alice',
    score: 0,
    userId: 'alice123',
    connected: true,
    slotNumber: 1,
    currentRoundRoleTargets: {
      bob123: 'snitch',
      eve123: 'con_artist',
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
      bob123: 'snitch',
    },
  },
  dave123: {
    name: 'Dave',
    userId: 'dave123',
    score: 0,
    connected: true,
    slotNumber: 4,
    currentRoundRoleTargets: {
      alice123: 'twin_girl',
      bob123: 'con_artist',
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
      bob123: 'con_artist',
    },
  },
  frank123: {
    name: 'Frank',
    userId: 'frank123',
    score: 0,
    connected: true,
    slotNumber: 6,
    currentRoundRoleTargets: {
      bob123: 'monk',
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
