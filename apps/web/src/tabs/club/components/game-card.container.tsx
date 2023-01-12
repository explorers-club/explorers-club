import { GameId } from '@explorers-club/room';
import { FC } from 'react';
import { GameCardComponent } from './game-card.component';

import { LITTLE_VIGILANTE_CONFIG } from '@explorers-club/little-vigilante/meta';
import { TRIVIA_JAM_CONFIG } from '@explorers-club/trivia-jam/configuration';
import { DIFFUSIONARY_CONFIG } from '@explorers-club/diffusionary/configuration';

interface Props {
  gameId: GameId;
}

const GAMES_CONFIG = {
  [LITTLE_VIGILANTE_CONFIG.gameId]: LITTLE_VIGILANTE_CONFIG,
  [DIFFUSIONARY_CONFIG.gameId]: DIFFUSIONARY_CONFIG,
  [TRIVIA_JAM_CONFIG.gameId]: TRIVIA_JAM_CONFIG,
} as const;

export const GameCard: FC<Props> = ({ gameId }) => {
  const config = GAMES_CONFIG[gameId];

  return <GameCardComponent {...config} />;
};
