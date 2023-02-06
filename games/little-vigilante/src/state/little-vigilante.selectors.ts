import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import { Role } from '../meta/little-vigilante.constants';

export const selectVigilantePlayerName = (
  state: LittleVigilanteStateSerialized
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [userId] = Object.entries(state.currentRoundRoles).find(
    ([, role]) => role === 'vigilante'
  )!;
  return state.players[userId]?.name;
};

export const selectTwinBoyPlayerName = (
  state: LittleVigilanteStateSerialized
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'twin_boy'
  );
  return result && state.players[result[0]]?.name;
};

export const selectTwinGirlPlayerName = (
  state: LittleVigilanteStateSerialized
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'twin_girl'
  );
  return result && state.players[result[0]]?.name;
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

export const selectPlayers = (state: LittleVigilanteStateSerialized) => {
  return Object.values(state.players);
};

export const selectPlayersWithNameAndRole = (
  state: LittleVigilanteStateSerialized
) => {
  return Object.entries(state.players).map(([_, { userId, name }]) => {
    return {
      userId: userId,
      name: name,
      role: state.currentRoundRoles[userId],
    };
  });
};

export const selectUnusedRoles = (state: LittleVigilanteStateSerialized) => {
  const roles = Array.from(state.roles);
  const usedRoles = Object.values(state.currentRoundRoles) as Role[];
  for (const role of usedRoles) {
    const index = roles.indexOf(role);
    if (index !== -1) {
      roles.splice(index, 1);
    }
  }
  return roles;
};
