import { useKeenSlider } from 'keen-slider/react';
import { Carousel, CarouselCell } from './Carousel';

export default {
  component: Carousel,
};

export const Primary = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free-snap',
    slides: {
      origin: 'center',
      perView: 2,
      spacing: 8,
    },
  });

  return (
    <Carousel sliderRef={sliderRef}>
      <CarouselCell css={{ height: '300px', background: 'green' }}>
        1
      </CarouselCell>
      <CarouselCell css={{ height: '300px', background: 'yellow' }}>
        2
      </CarouselCell>
      <CarouselCell css={{ height: '300px', background: 'red' }}>
        3
      </CarouselCell>
      <CarouselCell css={{ height: '300px', background: 'orange' }}>
        4
      </CarouselCell>
      <CarouselCell css={{ height: '300px', background: 'blue' }}>
        5
      </CarouselCell>
    </Carousel>
  );
};
