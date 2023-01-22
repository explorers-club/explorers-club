import { Box } from '@atoms/Box';
import { GAME_LIST } from '@explorers-club/room';
import { useSelector } from '@xstate/react';
import 'glider-js/glider.min.css';
import { useCallback, useContext } from 'react';
import Glider from 'react-glider';
import { AppContext } from '../../../state/app.context';
import { useIsHost } from '../club-tab.hooks';
import { GameCard } from './game-card.container';

export const GameCarousel = () => {
  const { clubTabActor } = useContext(AppContext);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const store = useSelector(clubTabActor, (state) => state.context.store!);
  const isHost = useIsHost();

  const handleSlideVisible = useCallback(
    (event: CustomEvent<{ slide: number }>) => {
      const { slide } = event.detail;
      const gameId = GAME_LIST[slide];
      if (isHost) {
        store.send({ type: 'SELECT_GAME', gameId });
      }
    },
    [store, isHost]
  );

  return (
    <Box css={{ position: 'relative' }}>
      <Glider
        hasDots
        draggable
        scrollLock
        onSlideVisible={handleSlideVisible}
        hasArrows
        // iconLeft={<ChevronLeftIcon />}
        // iconRight={<ChevronRightIcon />}
      >
        {GAME_LIST.map((gameId) => (
          <GameCard key={gameId} gameId={gameId} />
        ))}
      </Glider>
    </Box>
  );
};
