import { Box } from '@atoms/Box';
import { GAME_LIST } from '@explorers-club/room';
import { Carousel, CarouselCell } from '@molecules/Carousel';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useState } from 'react';
import { useClubStore, useIsHost, useSend } from '../club-tab.hooks';
import { selectSelectedGame } from '../club-tab.selectors';
import { GameCard } from './game-card.container';

export const GameCarousel = () => {
  const store = useClubStore();
  const [initial] = useState(() => {
    const selectedGameId = selectSelectedGame(store.getSnapshot());
    return GAME_LIST.indexOf(selectedGameId);
  });
  const isHost = useIsHost();
  const send = useSend();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial,
    slideChanged(slider) {
      const index = slider.track.details.rel;
      const gameId = GAME_LIST[index];
      if (isHost) {
        send({ type: 'SELECT_GAME', gameId });
      }
    },
    created(slider) {
      store.subscribe((state) => {
        const selectedGame = selectSelectedGame(state);
        const currentIndex = slider.track.details.rel;
        const newIndex = GAME_LIST.indexOf(selectedGame);
        if (currentIndex !== newIndex) {
          instanceRef.current?.moveToIdx(newIndex);
        }
      });
    },
    loop: true,
    mode: 'free-snap',
    slides: {
      origin: 'center',
      perView: 1.25,
      spacing: 8,
    },
  });

  return (
    <Box css={{ position: 'relative' }}>
      <Carousel css={{ pt: '$3' }} sliderRef={sliderRef}>
        {GAME_LIST.map((gameId) => (
          <CarouselCell key={gameId}>
            <GameCard key={gameId} gameId={gameId} />
          </CarouselCell>
        ))}
      </Carousel>
    </Box>
  );
};
