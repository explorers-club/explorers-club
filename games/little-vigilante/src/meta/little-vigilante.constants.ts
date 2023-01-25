export type Role =
  | 'detective'
  | 'cop'
  | 'vigilante'
  | 'student'
  | 'butler'
  | 'conspirator'
  | 'politician'
  | 'sidekick'
  | 'monk'
  | 'mayor'
  | 'anarchist';

export type Team = 'vigilante' | 'citizens' | 'anarchist';

export const teamByRole: Record<Role, Team> = {
  vigilante: 'vigilante',
  butler: 'vigilante',
  sidekick: 'vigilante',
  cop: 'citizens',
  student: 'citizens',
  detective: 'citizens',
  conspirator: 'citizens',
  politician: 'citizens',
  monk: 'citizens',
  mayor: 'citizens',
  anarchist: 'anarchist',
};

export const colorByTeam = {
  citizens: 'crimson',
  vigilante: 'yellow',
  anarchist: 'orange',
} as const;

const FOUR_PLAYER_ROLES = [
  'vigilante',
  'butler',
  'student',
  'student',
  'detective',
  'conspirator',
  'politician',
] as const;

const FIVE_PLAYER_ROLES = [...FOUR_PLAYER_ROLES, 'sidekick'] as const;

const SIX_PLAYER_ROLES = [...FIVE_PLAYER_ROLES, 'monk'] as const;

const SEVEN_PLAYER_ROLES = [...SIX_PLAYER_ROLES, 'cop'] as const;

const EIGHT_PLAYER_ROLES = [...SEVEN_PLAYER_ROLES, 'anarchist'] as const;

const NINE_PLAYER_ROLES = [...EIGHT_PLAYER_ROLES, 'mayor'] as const;

const TEN_PLAYER_ROLES = [...NINE_PLAYER_ROLES, 'student'] as const;

export const rolesByPlayerCount: Record<number, readonly Role[]> = {
  4: FOUR_PLAYER_ROLES,
  5: FIVE_PLAYER_ROLES,
  6: SIX_PLAYER_ROLES,
  7: SEVEN_PLAYER_ROLES,
  8: EIGHT_PLAYER_ROLES,
  9: NINE_PLAYER_ROLES,
  10: TEN_PLAYER_ROLES,
};

export const nightPhaseOrder = [
  'cop',
  'vigilante',
  'student',
  'butler',
  'detective',
  'conspirator',
  'politician',
  'sidekick',
  'monk',
] as const;

export const abilityByRole: Record<Role, string> = {
  cop: 'Has the ability to arrest one player, preventing them from using their ability.',
  vigilante:
    'Has the ability to see one role that is not in use by another player.',
  student: 'Has the ability to see which player is the other student.',
  butler: 'Has the ability to see which player is the vigilante.',
  detective:
    'Has the ability to investigate one player to find out their role.',
  conspirator: 'Has the ability to swap the roles of two other players.',
  politician: 'Has the ability to swap their role with another player.',
  sidekick: 'Has the ability to see which player is the vigilante.',
  monk: 'Has the ability to inspect their own role at the end of the night.',
  mayor: 'Has the ability to have their vote count twice.',
  anarchist: 'Has no special ability.',
};

const CITIZENS_OBJECTIVE =
  'Win if the vigilante or sidekick recives the most votes.';

export const objectiveByRole: Record<Role, string> = {
  cop: CITIZENS_OBJECTIVE,
  student: CITIZENS_OBJECTIVE,
  detective: CITIZENS_OBJECTIVE,
  conspirator: CITIZENS_OBJECTIVE,
  politician: CITIZENS_OBJECTIVE,
  monk: CITIZENS_OBJECTIVE,
  mayor: CITIZENS_OBJECTIVE,
  butler: "Win if the vigilante or sidekick don't receive the most votes.",
  sidekick: "Win if you or the vigilante don't receive the most votes.",
  vigilante: "Win if you or the sidekick don't receive the most votes.",
  anarchist: 'Win if you receive the most votes.',
};

export const imageByRole: Record<Role, string> = {
  detective:
    'https://media.discordapp.net/attachments/1000472333108129935/1062750832010997852/InspectorT_Polynesian_detective_character_chibi_NFT_funny_pose_23f7fe1f-4b9d-43ff-a385-e9373673815d.png?width=1194&height=1194',
  cop: 'https://media.discordapp.net/attachments/1000472333108129935/1062915115034366023/InspectorT_Polynesian_police_officer_character_cute_chibi_NFT_f_d92982a8-ad3a-45cb-8420-7c5a861798ae.png?width=1194&height=1194',
  student:
    'https://media.discordapp.net/attachments/1000472333108129935/1063133925469343754/InspectorT_Polynesian_student_character_cute_chibi_NFT_funny_po_4329e6f7-eb52-441f-b4fc-66d2f5045eb9.png?width=1194&height=1194',
  monk: 'https://media.discordapp.net/attachments/1000472333108129935/1063134258253811753/InspectorT_Polynesian_monk_character_cute_chibi_NFT_funny_pose_be91669d-679b-4a7a-b274-05c4fac11213.png?width=1194&height=1194',
  conspirator:
    'https://media.discordapp.net/attachments/1000472333108129935/1063134788447391754/InspectorT_Polynesian_conspirator_character_cute_chibi_NFT_funn_1595fb1f-12c3-4f0e-a2c6-7642798a8ded.png?width=1194&height=1194',
  anarchist:
    'https://media.discordapp.net/attachments/1000472333108129935/1063134573808078918/InspectorT_island_themed_anarchist_character_cute_chibi_NFT_fun_870930c5-ca5f-4f0b-bfc4-0cf55381071b.png?width=1194&height=1194',
  sidekick:
    'https://media.discordapp.net/attachments/1000472333108129935/1062751124031012934/InspectorT_Polynesian_citizen_character_Robin_chibi_NFT_funny_p_b54a55a3-1678-43f0-b6cd-3baedd00a712.png?width=1194&height=1194',
  politician:
    'https://media.discordapp.net/attachments/1000472333108129935/1063134149709410364/InspectorT_Polynesian_politician_character_cute_chibi_NFT_funny_51a3abad-4b84-4289-9660-1df349afa1f8.png?width=1194&height=1194',
  butler:
    'https://media.discordapp.net/attachments/1000472333108129935/1062749768381640806/InspectorT_Polynesian_butler_character_chibi_NFT_funny_pose_a39dc438-4a05-4789-9ddd-c350dab66875.png?width=1194&height=1194',
  mayor:
    'https://media.discordapp.net/attachments/1000472333108129935/1062748642143916123/InspectorT_Polynesian_Mayor_character_chibi_NFT_funny_pose_679b10d1-530e-4a42-ab1e-7bc5f7fb42aa.png?width=1194&height=1194',
  vigilante:
    'https://media.discordapp.net/attachments/1000472333108129935/1061250880566992906/InspectorT_Polynesian_Batman_character_chibi_NFT_funny_pose_e4451ce9-58d7-46ec-b98d-7ea3e312dc94.png?width=1194&height=1194',
};

export const iconByRole: Record<Role, string> = {
  detective:
    'https://media.discordapp.net/attachments/1000472333108129935/1067080488453427283/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_eefecbff-d979-40c4-9205-5b655b52dfa7.png?width=597&height=597',
  cop: 'https://media.discordapp.net/attachments/1000472333108129935/1067081377117376613/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_low_det_88317c51-84af-4c2a-8292-d87183d14144.png?width=597&height=597',
  student:
    'https://media.discordapp.net/attachments/1000472333108129935/1067081089044205618/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_83d4eb56-c51d-4946-be7d-e34f3fe49cda.png?width=597&height=597',
  monk: 'https://media.discordapp.net/attachments/1000472333108129935/1067078933373272187/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_1518494e-5b42-463e-b5dc-4447a69a91c8.png?width=597&height=597',
  conspirator:
    'https://media.discordapp.net/attachments/1000472333108129935/1067078840280678410/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_1a75323e-13da-4d2c-8faf-c8d7bea961a1.png?width=597&height=597',
  anarchist:
    'https://media.discordapp.net/attachments/1000472333108129935/1067079429265829938/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_57507136-d8ec-42fa-92a8-265235d9a710.png?width=597&height=597',
  sidekick:
    'https://media.discordapp.net/attachments/1000472333108129935/1067080468484329472/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_low_det_c57d682d-f037-4c8f-ad58-1c9e5bf99808.png?width=597&height=597',
  politician:
    'https://media.discordapp.net/attachments/1000472333108129935/1067080669064331386/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_low_det_39ee4c83-8030-48d5-8caf-f212fe0c33ea.png?width=597&height=597',
  butler:
    'https://media.discordapp.net/attachments/1000472333108129935/1067079581116411984/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_b772f691-ea84-458e-bbfc-46aae61847f8.png?width=597&height=597',
  mayor:
    'https://media.discordapp.net/attachments/1000472333108129935/1067079976471494726/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_low_det_6d3bebcf-4420-42f4-a7a2-644cb8f4387b.png?width=597&height=597',
  vigilante:
    'https://media.discordapp.net/attachments/1000472333108129935/1067081275426484224/InspectorT_flat_favicon_cutout_vector_svg_16x16_low_res_black_a_bfb84ef0-1d65-4082-a93e-e0776d2bcb55.png?width=597&height=597',
};
