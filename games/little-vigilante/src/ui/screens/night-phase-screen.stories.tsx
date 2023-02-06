import { Meta, Story } from '@storybook/react';
import {
  nightPhaseOrder,
  rolesByPlayerCount,
} from '../../meta/little-vigilante.constants';
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
  return <NightPhaseScreenComponent />;
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
  isabel123: {
    name: 'Isabel',
    userId: 'isabel123',
    score: 0,
    connected: true,
    slotNumber: 8,
    currentRoundRoleTargets: {},
  },
};

const roles = Array.from(nightPhaseOrder);

const currentRoundRoles = {
  alice123: roles[0],
  bob123: roles[1],
  charlie123: roles[2],
  dave123: roles[3],
  eve123: roles[4],
  frank123: roles[5],
};

const myUserId = 'alice123';

export const Cop = Template.bind({});

Cop.args = {
  myUserId,
  state: {
    roles,
    players,
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'cop',
    },
    currentStates: ['Playing.Round.NightPhase.Cop'],
  },
};

export const Vigilante = Template.bind({});

Vigilante.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.Vigilante'],
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
    currentStates: ['Playing.Round.NightPhase.Twins'],
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
    currentStates: ['Playing.Round.NightPhase.Twins'],
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
    currentStates: ['Playing.Round.NightPhase.Butler'],
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
    currentStates: ['Playing.Round.NightPhase.Detective'],
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

export const Conspirator = Template.bind({});

Conspirator.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles: [...roles],
    players,
    currentStates: ['Playing.Round.NightPhase.Conspirator'],
    initialCurrentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'conspirator',
    },
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'conspirator',
    },
  },
};

export const Politician = Template.bind({});

Politician.args = {
  myUserId,
  state: {
    timeRemaining: 57,
    roles,
    players,
    currentStates: ['Playing.Round.NightPhase.Politician'],
    currentRoundRoles: {
      ...currentRoundRoles,
      alice123: 'politician',
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
    currentStates: ['Playing.Round.NightPhase.Sidekick'],
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
    currentStates: ['Playing.Round.NightPhase.Monk'],
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
    currentStates: ['Playing.Round.NightPhase.Anarchist'],
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
    currentStates: ['Playing.Round.NightPhase.Mayor'],
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
