import 'keen-slider/keen-slider.min.css';
import { FC, forwardRef, ReactNode } from 'react';
import { Box } from '../atoms/Box';
import { CSS } from '../stitches.config';

interface Props {
  children?: ReactNode;
  css?: CSS;
  sliderRef: (node: HTMLDivElement | null) => void;
}

export const Carousel: FC<Props> = ({ css, children, sliderRef }) => {
  return (
    <Box css={css} className="keen-slider" ref={sliderRef}>
      {children}
    </Box>
  );
};

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
