import { ComponentStory } from '@storybook/react';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { AssigningRolesScreenComponent } from './assigning-roles-screen.component';
import {
  LittleVigilanteStory,
  withLittleVigilanteContext,
} from '../../test/withLittleVigilanteContext';
import { rolesByPlayerCount } from '../../meta/little-vigilante.constants';

export default {
  component: AssigningRolesScreenComponent,
  decorators: [withCardDecorator, withLittleVigilanteContext],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Butler: LittleVigilanteStory = (args) => {
  return <AssigningRolesScreenComponent />;
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

Butler.args = {
  myUserId: 'alice123',
  state: {
    roles: Array.from(rolesByPlayerCount[Object.values(players).length]),
    players,
    currentRoundRoles: {
      alice123: 'butler',
    },
  },
};

// export const Vigilante = Template.bind({});
// Vigilante.args = {
//   role: 'vigilante',
// };

// export const Butler = Template.bind({});
// Butler.args = {
//   role: 'butler',
// };

// export const Cop = Template.bind({});
// Cop.args = {
//   role: 'cop',
// };

// export const Detective = Template.bind({});
// Detective.args = {
//   role: 'detective',
// };

// export const Mayor = Template.bind({});
// Mayor.args = {
//   role: 'mayor',
// };

// export const Sidekick = Template.bind({});
// Sidekick.args = {
//   role: 'sidekick',
// };

// export const Monk = Template.bind({});
// Monk.args = {
//   role: 'monk',
// };

// export const Student = Template.bind({});
// Student.args = {
//   role: 'student',
// };

// export const Anarchist = Template.bind({});
// Anarchist.args = {
//   role: 'anarchist',
// };

// export const Snitch = Template.bind({});
// Snitch.args = {
//   role: 'snitch',
// };

// export const ConArtist = Template.bind({});
// ConArtist.args = {
//   role: 'con_artist',
// };
