import { Box } from '@atoms/Box';
import { A } from '@mobily/ts-belt';
import { Meta, Story } from '@storybook/react';
import { abilityGroups } from '../../meta/little-vigilante.constants';
import {
  LittleVigilanteMockState,
  withLittleVigilanteContext,
} from '../../test/withLittleVigilanteContext';
import { NightPhaseScreenComponent } from './night-phase-screen.component';

export default {
  component: NightPhaseScreenComponent,
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
      <NightPhaseScreenComponent />
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

const currentRoundRoles = {
  alice123: roles[0],
  bob123: roles[1],
  charlie123: roles[2],
  dave123: roles[3],
  eve123: roles[4],
  frank123: roles[5],
};

const myUserId = 'alice123';

export const Starting = Template.bind({});

Starting.args = {
  myUserId,
  state: {
    roles,
    players,
    currentTick: 9999,
    lastDownState: {
      alice123: 100,
      bob123: 100,
      charlie123: 100,
    },
    currentDownState: {
      dave123: true,
      eve123: true,
      frank123: true,
      grace123: true,
      heidi123: true,
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Starting'],
  },
};

export const TimedOut = Template.bind({});

TimedOut.args = {
  myUserId,
  state: {
    roles,
    players,
    currentTick: 9999,
    lastDownState: {
      alice123: 100,
      bob123: 100,
      charlie123: 100,
    },
    currentDownState: {
      dave123: true,
      eve123: true,
      frank123: true,
      grace123: true,
      heidi123: true,
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Cop'],
  },
};

export const CopActive = Template.bind({});

CopActive.args = {
  myUserId,
  state: {
    roles,
    players,
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Cop'],
  },
};

export const CopPrev = Template.bind({});

CopPrev.args = {
  myUserId,
  state: {
    roles,
    players,
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Vigilantes'],
  },
};

export const VigilanteActive = Template.bind({});

VigilanteActive.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Vigilantes'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'vigilante',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'vigilante',
    },
  },
};

export const TwinGirl = Template.bind({});

TwinGirl.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Twins'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'twin_girl',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'twin_girl',
    },
  },
};

export const TwinBoy = Template.bind({});

TwinBoy.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Twins'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'twin_boy',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'twin_boy',
    },
  },
};

export const Butler = Template.bind({});

Butler.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles: [...roles],
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Butler'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'butler',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'butler',
    },
  },
};

export const Detective = Template.bind({});

Detective.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles: [...roles],
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Detective'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'detective',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'detective',
    },
  },
};

export const Snitch = Template.bind({});

Snitch.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles: [...roles],
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Snitch'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'snitch',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'snitch',
    },
  },
};

export const ConArtist = Template.bind({});

ConArtist.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.ConArtist'],
    currentTick: 100,
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'con_artist',
    },
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'con_artist',
    },
  },
};

export const Sidekick = Template.bind({});

Sidekick.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Vigilantes'],
    currentDownState: {},
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'sidekick',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'sidekick',
    },
  },
};

export const Monk = Template.bind({});

Monk.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.Monk'],
    currentDownState: {},
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'monk',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'monk',
    },
  },
};

export const Anarchist = Template.bind({});

Anarchist.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.NoAbility'],
    currentDownState: {},
    initialCurrentRoundRoles: {},
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'anarchist',
    },
  },
};

export const Mayor = Template.bind({});

Mayor.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.AbilityGroup.Running.NoAbility'],
    currentTick: 100,
    lastDownState: {
      [myUserId]: 0,
    },
    currentDownState: {},
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'mayor',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'mayor',
    },
  },
};
