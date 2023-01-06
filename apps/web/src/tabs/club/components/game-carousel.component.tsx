import 'glider-js/glider.min.css';
import Glider from 'react-glider';
import { GameCard } from './game-card.container';

export const GameCarousel = () => {
  return (
    <Glider hasDots>
      <GameCard gameId="trivia_jam" />
      <GameCard gameId="diffusionary" />
    </Glider>
  );
};
