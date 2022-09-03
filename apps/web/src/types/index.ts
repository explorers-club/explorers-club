import { SnakeToCamelCaseNested } from './utils';

// When you first connect to a server, what info do you need for each player?

export type Player = {
  id: string;
  name: string;
};

export type LobbyPlayer = Player & {
  isReady: boolean;
};

// export type ProfileDef = definitions['profiles'];
// export type Profile = SnakeToCamelCaseNested<ProfileDef>;

// export type PartyDef = definitions['parties'];
// export type Party = SnakeToCamelCaseNested<PartyDef>;

// export type GameDef = definitions['games'];
// export type Game = SnakeToCamelCaseNested<PartyDef>;

// export type GameInstanceDef = definitions['game_instances'];
// export type GameInstance = SnakeToCamelCaseNested<GameInstanceDef>;
