import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import { Role, rolesByPlayerCount } from '../meta/little-vigilante.constants';

export const selectVigilantePlayerName = (
  state: LittleVigilanteStateSerialized
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [userId] = Object.entries(state.currentRoundRoles).find(
    ([, role]) => role === 'vigilante'
  )!;
  return state.players[userId]?.name;
};

export const selectPlayersWithName = (
  state: LittleVigilanteStateSerialized
) => {
  return Object.entries(state.players).map(([userId, player]) => {
    return {
      userId,
      name: player.name,
    };
  });
};

export const selectPlayersWithNameAndRole = (
  state: LittleVigilanteStateSerialized
) => {
  return Object.entries(state.players).map(([userId, player]) => {
    return {
      userId,
      name: player.name,
      role: state.currentRoundRoles[userId],
    };
  });
};

export const selectUnusedRoles = (state: LittleVigilanteStateSerialized) => {
  const playerCount = Object.keys(state.players).length;
  const roles = Array.from(rolesByPlayerCount[playerCount]);
  const usedRoles = Object.values(state.currentRoundRoles) as Role[];
  for (const role of usedRoles) {
    const index = roles.indexOf(role);
    if (index !== -1) {
      roles.splice(index, 1);
    }
  }
  return roles;
};
