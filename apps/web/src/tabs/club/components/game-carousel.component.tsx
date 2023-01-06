import { GameId } from '@explorers-club/room';
import { useSelector } from '@xstate/react';
import 'glider-js/glider.min.css';
import { useCallback, useContext } from 'react';
import Glider from 'react-glider';
import { AppContext } from '../../../state/app.context';
import { GameCard } from './game-card.container';

const GAME_LIST: GameId[] = ['trivia_jam', 'diffusionary'];

export const GameCarousel = () => {
  const { modalActor, clubTabActor } = useContext(AppContext);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const store = useSelector(clubTabActor, (state) => state.context.store!);

  const handleSlideVisible = useCallback(
    (event: CustomEvent<{ slide: number }>) => {
      const { slide } = event.detail;
      const gameId = GAME_LIST[slide];
      store.send({ type: 'SELECT_GAME', gameId });
    },
    [store]
  );

  return (
    <Glider hasDots draggable onSlideVisible={handleSlideVisible}>
      <GameCard gameId="trivia_jam" />
      <GameCard gameId="diffusionary" />
    </Glider>
  );
};
