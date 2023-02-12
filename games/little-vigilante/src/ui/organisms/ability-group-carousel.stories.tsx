import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { rolesByPlayerCount } from '../../meta/little-vigilante.constants';
import { withLittleVigilanteContext } from '../../test/withLittleVigilanteContext';
import { AbilityGroupCarousel } from './ability-group-carousel.component';

export default {
  component: AbilityGroupCarousel,
  decorators: [withCardDecorator, withLittleVigilanteContext],
  parameters: {
    cardCSS: {
      p: '$0',
    },
  },
};

export const Default = () => {
  return <AbilityGroupCarousel />;
};

const players = {
  alice123: {
    name: 'Alice',
    slotNumber: 1,
    currentRoundRoleTargets: {
      bob123: 'twin_boy',
      dave123: 'mayor',
    },
  },
  bob123: {
    name: 'Bob',
    slotNumber: 2,
    currentRoundRoleTargets: {},
  },
  charlie123: {
    name: 'Charlie',
    slotNumber: 3,
    currentRoundRoleTargets: {},
  },
  dave123: {
    name: 'Dave',
    slotNumber: 4,
    currentRoundRoleTargets: {},
  },
};

Default.args = {
  myUserId: 'alice123',
  state: {
    roles: rolesByPlayerCount['4'],
    players,
    currentStates: ['Playing.Round.NightPhase.Role.Vigilante'],
    initialCurrentRoundRoles: {
      alice123: 'monk',
      bob123: 'twin_boy',
      charlie123: 'sidekick',
      dave123: 'vigilante',
    },
    currentRoundRoles: {
      alice123: 'monk',
      bob123: 'twin_boy',
      charlie123: 'sidekick',
      dave123: 'vigilante',
    },
  },
};
