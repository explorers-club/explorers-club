import { GameId } from '@explorers-club/room';
import { FC } from 'react';
import { GameCardComponent } from './game-card.component';

import { CODEBREAKERS_METADATA } from '@explorers-club/codebreakers/meta/index';
import { DIFFUSIONARY_METADATA } from '@explorers-club/diffusionary/meta/index';
import { LITTLE_VIGILANTE_METADATA } from '@explorers-club/little-vigilante/meta/index';
import { TRIVIA_JAM_METADATA } from '@explorers-club/trivia-jam/meta/index';

interface Props {
  gameId: GameId;
}

const GAMES_CONFIG = {
  [LITTLE_VIGILANTE_METADATA.gameId]: LITTLE_VIGILANTE_METADATA,
  [CODEBREAKERS_METADATA.gameId]: CODEBREAKERS_METADATA,
  [DIFFUSIONARY_METADATA.gameId]: DIFFUSIONARY_METADATA,
  [TRIVIA_JAM_METADATA.gameId]: TRIVIA_JAM_METADATA,
} as const;

export const GameCard: FC<Props> = ({ gameId }) => {
  const config = GAMES_CONFIG[gameId];

  return <GameCardComponent {...config} />;
};
