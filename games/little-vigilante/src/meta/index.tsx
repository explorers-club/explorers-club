import { LittleVigilanteGameInfoScreen } from './little-vigilante-game-info-screen.component';

export const LITTLE_VIGILANTE_CONFIG = {
  gameId: 'little_vigilante',
  displayName: 'Litle Vigilante',
  minPlayers: 4,
  maxPlayers: 10,
  coverImageUrl:
    'https://media.discordapp.net/attachments/1000472333108129935/1061250880566992906/InspectorT_Polynesian_Batman_character_chibi_NFT_funny_pose_e4451ce9-58d7-46ec-b98d-7ea3e312dc94.png?width=1194&height=1194',
  GameInfoScreenComponent: <LittleVigilanteGameInfoScreen />,
} as const;
