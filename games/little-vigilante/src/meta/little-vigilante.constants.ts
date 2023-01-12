export const teamByRole: Record<string, string> = {
  vigilante: 'vigilante',
  sidekick: 'vigilante',
  butler: 'vigilante',
  citizen: 'citizens',
  mayor: 'citizens',
  detective: 'citizens',
  cop: 'citizens',
  jester: 'citizens',
  student: 'citizens',
  monk: 'citizens',
  anarchist: 'anarchist',
};

export const nightPhaseOrder = [
  'cop',
  'vigilante',
  'student',
  'butler',
  'detective',
  'jester',
  'politician',
  'sidekick',
  'monk',
];

export const abilityByRole: Record<string, string> = {
  cop: 'Has the ability to arrest one player, preventing them from using their ability.',
  vigilante:
    'Has the ability to see one role that is not in use by another player.',
  student: 'Has the ability to see which player is the other student.',
  detective:
    'Has the ability to investigate one player to find out their role.',
  jester: 'Has the ability to swap the roles of two other players.',
  butler: 'Has the ability to see which player is the vigilante.',
  politician: 'Has the ability to swap their role with another player.',
  sidekick: 'Has the ability to see which player is the vigilante.',
  monk: 'Has the ability to inspect their own role at the end of the night.',
  mayor: 'Has the ability to have their vote count twice.',
  anarchist: 'Has no special ability.',
};

export const objectiveByTeam: Record<string, string> = {
  anarchist: 'Convince others that you are the vigilante',
  citizens: 'Identify the vigilante',
  vigilante: 'Protect the identity of the vigilante',
};

export const imageByRole: Record<string, string> = {
  jester:
    'https://media.discordapp.net/attachments/1000472333108129935/1062751904892977312/InspectorT_Polynesian_jester_character_cutechibi_NFT_funny_pose_7f76dee7-31c9-4df2-bd6b-a87fdc5b075c.png?width=1194&height=1194',
  detective:
    'https://media.discordapp.net/attachments/1000472333108129935/1062750832010997852/InspectorT_Polynesian_detective_character_chibi_NFT_funny_pose_23f7fe1f-4b9d-43ff-a385-e9373673815d.png?width=1194&height=1194',
  cop: 'https://media.discordapp.net/attachments/1000472333108129935/1062915115034366023/InspectorT_Polynesian_police_officer_character_cute_chibi_NFT_f_d92982a8-ad3a-45cb-8420-7c5a861798ae.png?width=1194&height=1194',
  citizen:
    'https://media.discordapp.net/attachments/1000472333108129935/1062750148402364538/InspectorT_Polynesian_citizen_character_chibi_NFT_funny_pose_1788e3ae-7499-4011-ab27-0453644e5e1d.png?width=1194&height=1194',
  sidekick:
    'https://media.discordapp.net/attachments/1000472333108129935/1062751124031012934/InspectorT_Polynesian_citizen_character_Robin_chibi_NFT_funny_p_b54a55a3-1678-43f0-b6cd-3baedd00a712.png?width=1194&height=1194',
  butler:
    'https://media.discordapp.net/attachments/1000472333108129935/1062749768381640806/InspectorT_Polynesian_butler_character_chibi_NFT_funny_pose_a39dc438-4a05-4789-9ddd-c350dab66875.png?width=1194&height=1194',
  mayor:
    'https://media.discordapp.net/attachments/1000472333108129935/1062748642143916123/InspectorT_Polynesian_Mayor_character_chibi_NFT_funny_pose_679b10d1-530e-4a42-ab1e-7bc5f7fb42aa.png?width=1194&height=1194',
  vigilante:
    'https://media.discordapp.net/attachments/1000472333108129935/1061250880566992906/InspectorT_Polynesian_Batman_character_chibi_NFT_funny_pose_e4451ce9-58d7-46ec-b98d-7ea3e312dc94.png?width=1194&height=1194',
};
