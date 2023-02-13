import { useKeenSlider } from 'keen-slider/react';
import { Slider, SliderCell } from './Slider';

export default {
  component: Slider,
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
    <Slider sliderRef={sliderRef}>
      <SliderCell css={{ height: '300px', background: 'green' }}>
        1
      </SliderCell>
      <SliderCell css={{ height: '300px', background: 'yellow' }}>
        2
      </SliderCell>
      <SliderCell css={{ height: '300px', background: 'red' }}>
        3
      </SliderCell>
      <SliderCell css={{ height: '300px', background: 'orange' }}>
        4
      </SliderCell>
      <SliderCell css={{ height: '300px', background: 'blue' }}>
        5
      </SliderCell>
    </Slider>
  );
};
