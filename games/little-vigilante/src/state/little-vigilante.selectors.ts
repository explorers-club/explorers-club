import { LittleVigilanteStateSerialized } from '@explorers-club/room';
import { createSelector } from 'reselect';
import {
  AbilityGroup,
  abilityGroups,
  AbilityGroupSchema,
  Role,
} from '../meta/little-vigilante.constants';

export const selectMonkPlayer = (state: LittleVigilanteStateSerialized) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tuple = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'monk'
  );
  return tuple ? state.players[tuple[0]] : undefined;
};

export const selectButlerPlayer = (state: LittleVigilanteStateSerialized) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tuple = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'butler'
  );
  return tuple ? state.players[tuple[0]] : undefined;
};

export const selectSidekickPlayer = (state: LittleVigilanteStateSerialized) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tuple = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'sidekick'
  );
  return tuple ? state.players[tuple[0]] : undefined;
};

export const selectVigilantePlayer = (
  state: LittleVigilanteStateSerialized
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [userId] = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'vigilante'
  )!;
  return state.players[userId];
};

export const selectVigilantePlayerName = createSelector(
  selectVigilantePlayer,
  (player) => player.name
);
export const selectSidekickPlayerName = createSelector(
  selectSidekickPlayer,
  (player) => player?.name
);

export const selectTwinBoyPlayer = (state: LittleVigilanteStateSerialized) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'twin_boy'
  );
  return result && state.players[result[0]];
};

export const selectTwinGirlPlayer = (state: LittleVigilanteStateSerialized) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = Object.entries(state.initialCurrentRoundRoles).find(
    ([, role]) => role === 'twin_girl'
  );
  return result && state.players[result[0]];
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

export const selectIdlePlayers = (state: LittleVigilanteStateSerialized) =>
  Object.values(state.players)
    .filter((player) => {
      // Not idle if current press state is down
      if (state.currentDownState[player.userId]) {
        return false;
      }

      // Not idle if they have a down state within the timeout window
      const ts = state.lastDownState[player.userId];
      const TIMEOUT_SECONDS = 10;
      const TICK_TIMEOUT_SECONDS_AGO = state.currentTick - 60 * TIMEOUT_SECONDS;
      if (ts && ts >= TICK_TIMEOUT_SECONDS_AGO) {
        return false;
      }

      return true;
    })
    .sort(
      (playerA, playerB) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.lastDownState[playerA.userId]! -
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.lastDownState[playerB.userId]!
    );
