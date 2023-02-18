import { z } from 'zod';
import { RoleSchema } from '../schema';

export type Role = z.infer<typeof RoleSchema>;

export type Team = 'vigilante' | 'citizens' | 'anarchist';

export const AbilityGroupSchema = z.enum([
  'Cop',
  'Vigilantes',
  'Butler',
  'Twins',
  'Detective',
  'ConArtist',
  'Snitch',
  'Monk',
  'NoAbility',
]);

export type AbilityGroup = z.infer<typeof AbilityGroupSchema>;

export const abilityGroups: Record<AbilityGroup, Role[]> = {
  Cop: ['cop'],
  Vigilantes: ['vigilante', 'sidekick'],
  Butler: ['butler'],
  Twins: ['twin_boy', 'twin_girl'],
  Detective: ['detective'],
  ConArtist: ['con_artist'],
  Snitch: ['snitch'],
  Monk: ['monk'],
  NoAbility: ['anarchist', 'mayor'],
};

export const teamByRole: Record<Role, Team> = {
  vigilante: 'vigilante',
  butler: 'vigilante',
  sidekick: 'vigilante',
  cop: 'citizens',
  twin_girl: 'citizens',
  twin_boy: 'citizens',
  detective: 'citizens',
  snitch: 'citizens',
  con_artist: 'citizens',
  monk: 'citizens',
  mayor: 'citizens',
  anarchist: 'anarchist',
};

export const rolesByTeam = Object.entries(teamByRole).reduce(
  (acc, [role, team]) => {
    acc[team] ||= [];
    acc[team].push(role as Role);
    return acc;
  },
  {} as Record<Team, Role[]>
);

export const colorByTeam = {
  citizens: 'cyan',
  vigilante: 'magenta',
  anarchist: 'gold',
} as const;

export const getTeamThemeColor = (team: Team) => {
  const color = colorByTeam[team];
  const colorToTheme = {
    magenta: 'crimson',
    cyan: 'cyan',
    gold: 'amber',
  } as const;
  return colorToTheme[color];
};

export const colorNameToPrimaryColor = {
  yellow: 'F5D90A',
  white: 'FFFFFF',
  red: 'E5484D',
  green: '30A46C',
  blue: '0091FF',
  purple: '8E4EC6',
  pink: 'D6409F',
  orange: 'F76808',
  brown: 'AD7F58',
  black: '000000',
} as const;

export const primaryColorByRole = {
  vigilante: 'indigo',
  butler: 'black',
  sidekick: 'red',
  cop: 'blue',
  twin_girl: 'green',
  twin_boy: 'green',
  detective: 'orange',
  con_artist: 'yellow',
  snitch: 'green',
  monk: 'brown',
  mayor: 'silver',
  anarchist: 'white',
} as const;

export const secondaryColorByRole = {
  vigilante: 'yellow',
  butler: 'silver',
  sidekick: 'yellow',
  cop: 'black',
  twin_girl: 'red',
  twin_boy: 'red',
  detective: 'brown',
  con_artist: 'orange',
  snitch: 'brown',
  monk: 'tan',
  mayor: 'green',
  anarchist: 'green',
} as const;

export const ROLE_LIST = [
  'vigilante',
  'sidekick',
  'butler',
  'twin_girl',
  'twin_boy',
  'detective',
  'con_artist',
  'snitch',
  'monk',
  'cop',
  'mayor',
  'anarchist',
] as Role[];

export const roleOrderIndex = ROLE_LIST.reduce((result, role, index) => {
  result[role] = index;
  return result;
}, {} as Record<Role, number>);

const FOUR_PLAYER_ROLES = [
  'vigilante',
  'sidekick',
  'twin_girl',
  'twin_boy',
  'detective',
  'snitch',
  'monk',
] as const;

const FIVE_PLAYER_ROLES = [...FOUR_PLAYER_ROLES, 'con_artist'] as const;

const SIX_PLAYER_ROLES = [...FIVE_PLAYER_ROLES, 'butler'] as const;

const SEVEN_PLAYER_ROLES = [...SIX_PLAYER_ROLES, 'anarchist'] as const;

const EIGHT_PLAYER_ROLES = [...SEVEN_PLAYER_ROLES, 'cop'] as const;

const NINE_PLAYER_ROLES = [...EIGHT_PLAYER_ROLES, 'mayor'] as const;

export const rolesByPlayerCount: Record<number, readonly Role[]> = {
  4: FOUR_PLAYER_ROLES,
  5: FIVE_PLAYER_ROLES,
  6: SIX_PLAYER_ROLES,
  7: SEVEN_PLAYER_ROLES,
  8: EIGHT_PLAYER_ROLES,
  9: NINE_PLAYER_ROLES,
};

// todo move this in to i18n
export const displayNameByRole: Record<Role, string> = {
  cop: 'Cop',
  vigilante: 'Vigilante',
  twin_girl: 'Twin (girl)',
  twin_boy: 'Twin (boy)',
  butler: 'Butler',
  detective: 'Detective',
  con_artist: 'Con Artist',
  snitch: 'Snitch',
  sidekick: 'Sidekick',
  monk: 'Monk',
  mayor: 'Mayor',
  anarchist: 'Anarchist',
};

export const abilityByRole: Record<Role, string> = {
  cop: 'Has the ability to arrest one player, preventing them from using their ability.',
  vigilante:
    'Has the ability to see who is the sidekick. If there is no sidekick they, can see a random role not being played.',
  twin_girl: 'Has the ability to see which player is the other twin.',
  twin_boy: 'Has the ability to see which player is the other twin.',
  butler: 'Has the ability to see which player is the vigilante.',
  detective:
    'Has the ability to investigate one player to find out their role.',
  snitch: 'Has the ability to swap the roles of two other players.',
  con_artist: 'Has the ability to swap their role with another player.',
  sidekick: 'Has the ability to see who is the vigilante.',
  monk: 'Has the ability to inspect their own role at the end of the night.',
  mayor: 'Has the ability to have their vote count twice.',
  anarchist: 'Has no special ability.',
};

const CITIZENS_OBJECTIVE =
  'Win if the vigilante or sidekick recives the most votes.';

export const objectiveByRole: Record<Role, string> = {
  cop: CITIZENS_OBJECTIVE,
  twin_boy: CITIZENS_OBJECTIVE,
  twin_girl: CITIZENS_OBJECTIVE,
  detective: CITIZENS_OBJECTIVE,
  con_artist: CITIZENS_OBJECTIVE,
  snitch: CITIZENS_OBJECTIVE,
  monk: CITIZENS_OBJECTIVE,
  mayor: CITIZENS_OBJECTIVE,
  butler: "Win if the vigilante or sidekick don't receive the most votes.",
  sidekick: "Win if you or the vigilante don't receive the most votes.",
  vigilante: "Win if you or the sidekick don't receive the most votes.",
  anarchist: 'Win if you receive the most votes.',
};

export const getAvatarImageByRole = (role: Role) => {
  return `/assets/little-vigilante/images/${role}_avatar.png`;
};

export const getFullImageByRole = (role: Role) => {
  return `/assets/little-vigilante/images/${role}_full.png`;
};
