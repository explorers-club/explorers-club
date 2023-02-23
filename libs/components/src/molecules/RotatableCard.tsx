import { styled, CSS } from '../stitches.config';
import { FC, forwardRef, ReactNode } from 'react';
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';

const Scene = styled('div', {
  width: '260px',
  height: '200px',
  perspective: '1000px',
  position: 'relative',

  '& .carousel.keen-slider': {
    width: '100%',
    height: '100%',
    overflow: 'visible',
    position: 'absolute',
    webkitTransform: 'translateZ(-288px)',
    mozTransform: 'translateZ(-288px)',
    transform: 'translateZ(-288px)',
    webkitTransformStyle: 'preserve-3d',
    mozTransformStyle: 'preserve-3d',
    transformStyle: 'preserve-3d',

    '& .carousel__cell': {
      position: 'absolute',
      width: 'calc(100% - 20px)',
      left: '10px',
      height: '100%',
      border: '1px solid rgba(0, 0, 0, 0.3)',

      maxHeight: '100vh',

      '@hover': {
        '&:hover': {
          cursor: 'grab',
          // boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)',
        },
      },
    },
  },
});

interface Props {
  children?: ReactNode;
  css?: CSS;
}

export const RotatableCard: FC<Props> = ({ css, children }) => {
  const carousel: KeenSliderPlugin = (slider) => {
    const z = slider.slides[0].clientWidth / 2;

    function rotate() {
      const deg = 360 * slider.track.details.progress;
      slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
    }
    slider.on('created', () => {
      const deg = 360 / slider.slides.length;
      slider.slides.forEach((element, idx) => {
        element.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`;
      });
      rotate();
    });
    slider.on('detailsChanged', rotate);
  };

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      selector: '.carousel__cell',
      renderMode: 'custom',
      mode: 'free-snap',
    },
    [carousel]
  );
  return (
    <Scene className="scene" css={css}>
      <Box className="carousel keen-slider" ref={sliderRef}>
        {children}
      </Box>
    </Scene>
  );
};

interface CellProps {
  children: ReactNode;
  css?: CSS;

  as?: any;
  href?: string;
  variant?: 'interactive' | 'ghost' | 'active' | undefined;
}

export const CenterContent = forwardRef<HTMLDivElement, CellProps>(
  ({ css, children, as, href, variant }, ref) => (
    <Card
      as={as}
      href={href}
      variant={variant}
      ref={ref}
      className="carousel__cell"
      css={css}
    >
      {children}
    </Card>
  )
);
export const RightContent = forwardRef<HTMLDivElement, CellProps>(
  ({ css, children, as, href, variant }, ref) => (
    <Card
      as={as}
      href={href}
      variant={variant}
      ref={ref}
      className="carousel__cell"
      css={css}
    >
      {children}
    </Card>
  )
);
export const BackContent = forwardRef<HTMLDivElement, CellProps>(
  ({ css, children, as, href, variant }, ref) => (
    <Card
      as={as}
      href={href}
      variant={variant}
      ref={ref}
      className="carousel__cell"
      css={css}
    >
      {children}
    </Card>
  )
);
export const LeftContent = forwardRef<HTMLDivElement, CellProps>(
  ({ css, children, as, href, variant }, ref) => (
    <Card
      as={as}
      href={href}
      variant={variant}
      ref={ref}
      className="carousel__cell"
      css={css}
    >
      {children}
    </Card>
  )
);
