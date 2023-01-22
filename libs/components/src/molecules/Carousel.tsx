import { FC, forwardRef, ReactNode, useMemo } from 'react';
import { Box } from '../atoms/Box';
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { CSSProperties } from '@stitches/react';
import { CSS } from '../stitches.config';

interface Props {
  children?: ReactNode;
  css?: CSS;
  sliderRef: (node: HTMLDivElement | null) => void;
}

const CELL_CLASS_NAME = 'carousel__cell';

export const Carousel: FC<Props> = ({ css, children, sliderRef }) => {
  //   const [sliderRef] = useKeenSlider<HTMLDivElement>({
  //     loop: true,
  //     selector: `.${CELL_CLASS_NAME}`,
  //     mode: 'free-snap',
  //     slides: {
  //       perView: 3,
  //       spacing: 8,
  //     },
  //   });

  return (
    <Box css={css} className="keen-slider" ref={sliderRef}>
      {children}
    </Box>
  );
};
// export const Carousel = forwardRef<HTMLDivElement, Props>(
//   ({ children }, ref) => (
//     <Box ref={ref} className="carousel">
//       {children}
//     </Box>
//   )
// );

interface CellProps {
  children: ReactNode;
  css?: CSS;
}

export const CarouselCell = forwardRef<HTMLDivElement, CellProps>(
  ({ css, children }, ref) => (
    <Box css={css} ref={ref} className="keen-slider__slide">
      {children}
    </Box>
  )
);
