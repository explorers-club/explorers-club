// import { SnakeToCamelCaseNested } from './utils';

import { FC } from 'react';
import {
  snapPoints,
  defaultSnapProps,
} from 'react-spring-bottom-sheet/dist/types';

export interface LayoutMeta {
  snapPoints?: snapPoints;
  defaultSnap?: number | ((props: defaultSnapProps) => number) | undefined;
  footer?: FC<unknown>;
}

// export type ProfileDef = definitions['profiles'];
// export type Profile = SnakeToCamelCaseNested<ProfileDef>;

// export type PartyDef = definitions['parties'];
// export type Party = SnakeToCamelCaseNested<PartyDef>;

// export type GameDef = definitions['games'];
// export type Game = SnakeToCamelCaseNested<PartyDef>;

// export type GameInstanceDef = definitions['game_instances'];
// export type GameInstance = SnakeToCamelCaseNested<GameInstanceDef>;
