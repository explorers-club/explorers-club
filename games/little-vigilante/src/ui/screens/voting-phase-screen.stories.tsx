import { Box } from '@atoms/Box';
import { A } from '@mobily/ts-belt';
import { Meta, Story } from '@storybook/react';
import { abilityGroups } from '../../meta/little-vigilante.constants';
import {
  LittleVigilanteMockState,
  withLittleVigilanteContext,
} from '../../test/withLittleVigilanteContext';
import { VotingPhaseScreen } from './voting-phase-screen.component';

export default {
  component: VotingPhaseScreen,
  decorators: [withLittleVigilanteContext],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} as Meta;

const Template: Story<LittleVigilanteMockState> = (args) => {
  return (
    <Box css={{ height: '100vh' }}>
      <VotingPhaseScreen />
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
    currentRoundRoleTargets: {},
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
    currentRoundRoleTargets: {},
  },
  dave123: {
    name: 'Dave',
    userId: 'dave123',
    score: 0,
    connected: true,
    slotNumber: 4,
    currentRoundRoleTargets: {},
  },
  eve123: {
    name: 'Eve',
    userId: 'eve123',
    score: 0,
    connected: true,
    slotNumber: 5,
    currentRoundRoleTargets: {},
  },
  frank123: {
    name: 'Frank',
    userId: 'frank123',
    score: 0,
    connected: true,
    slotNumber: 6,
    currentRoundRoleTargets: {},
  },
  grace123: {
    name: 'Grace',
    userId: 'grace123',
    score: 0,
    connected: true,
    slotNumber: 7,
    currentRoundRoleTargets: {},
  },
  heidi123: {
    name: 'Heidi',
    userId: 'heidi123',
    score: 0,
    connected: true,
    slotNumber: 8,
    currentRoundRoleTargets: {},
  },
};

const roles = Array.from(A.flat(Object.values(abilityGroups)));

const myUserId = 'alice123';

export const VotesSubmitted = Template.bind({});

VotesSubmitted.args = {
  myUserId,
  state: {
    roles,
    players,
    currentTick: 9999,
    hostUserIds: ['alice123'],
    currentRoundVotes: {
      alice123: 'bob123',
      grace123: 'eve123',
      dave123: 'eve123',
    },
    currentStates: ['Playing.Round.Voting.Idle'],
  },
};

export const Revealed = Template.bind({});

Revealed.args = {
  myUserId,
  state: {
    roles,
    players,
    currentTick: 9999,
    currentRoundVotes: {
      alice123: 'bob123',
      grace123: 'eve123',
      dave123: 'eve123',
    },
    hostUserIds: ['alice123'],
    currentRoundRoles: {
      alice123: 'vigilante',
      bob123: 'snitch',
      charlie123: 'twin_girl',
      dave123: 'twin_boy',
      eve123: 'sidekick',
      frank123: 'anarchist',
      grace123: 'monk',
      heidi123: 'cop',
    },
    currentStates: ['Playing.Round.Reveal'],
    currentRoundPoints: {
      alice123: 1,
      bob123: 0,
      charlie123: 0,
      dave123: 0,
      eve123: 1,
      frank123: 0,
      grace123: 0,
      heidi123: 0,
    },
  },
};
