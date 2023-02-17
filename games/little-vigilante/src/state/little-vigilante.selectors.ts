import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import {
  AbilityGroup,
  abilityGroups,
  AbilityGroupSchema,
  Role,
} from '../meta/little-vigilante.constants';

export const selectVigilantePlayerName = (
  state: LittleVigilanteStateSerialized
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [userId] = Object.entries(state.currentRoundRoles).find(
    ([, role]) => role === 'vigilante'
  )!;
  return state.players[userId]?.name;
};

export const selectSidekickPlayerName = (
  state: LittleVigilanteStateSerialized
) => {
  const tuple = Object.entries(state.currentRoundRoles).find(
    ([, role]) => role === 'sidekick'
  );
  if (!tuple) {
    return;
  }
  return state.players[tuple[0]]?.name;
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

export const selectPlayers = (state: LittleVigilanteStateSerialized) => {
  return Object.values(state.players);
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
  return Object.entries(state.players).map(
    ([_, { userId, name, slotNumber }]) => {
      return {
        userId: userId,
        name: name,
        slotNumber: slotNumber,
        role: state.currentRoundRoles[userId],
      };
    }
  );
};

export const selectRoles = (state: LittleVigilanteStateSerialized) => {
  return state.roles as Role[];
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

export const selectAbilityGroups = (state: LittleVigilanteStateSerialized) => {
  const result: Partial<Record<AbilityGroup, Role[]>> = {};

  Object.entries(abilityGroups).forEach(([group, roles]) => {
    if (roles.some((role) => state.roles.includes(role))) {
      result[group as AbilityGroup] = roles.filter((role) =>
        state.roles.includes(role)
      );
    }
  });

  return result;
};

export const selectAbilityGroup = (state: LittleVigilanteStateSerialized) =>
  Array.from(state.currentStates.values())
    .map((state) => {
      const tokens = state.split(
        'Playing.Round.NightPhase.AbilityGroup.Running.'
      );
      if (tokens.length === 2) {
        const parse = AbilityGroupSchema.safeParse(tokens[1]);
        if (parse.success) {
          return parse.data;
        }
      }
      return null;
    })
    .find((val) => val);

export const selectPlayerOutcomes = (state: LittleVigilanteStateSerialized) => {
  return Object.entries(state.currentRoundRoles).map(([userId, role]) => ({
    playerName: state.players[userId].name,
    role: role as Role,
    winner: state.currentRoundPoints[userId] === 1,
    slotNumber: state.players[userId].slotNumber,
    userId,
  }));
};

export const selectIsVoteCalled = (state: LittleVigilanteStateSerialized) =>
  state.currentStates.includes('Playing.Round.DiscussionPhase.VoteCalled');

export const selectIsVoteFailed = (state: LittleVigilanteStateSerialized) =>
  state.currentStates.includes('Playing.Round.DiscussionPhase.VoteFailed');