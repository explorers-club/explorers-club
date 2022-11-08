import { styled } from '@stitches/react';
import { blackA, mauve, red, violet } from '@radix-ui/colors';

export const Button = styled('button', {
  all: 'unset',
//   display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      violet: {
        backgroundColor: 'white',
        color: violet.violet11,
        '&:hover': { backgroundColor: mauve.mauve3 },
      },
      red: {
        backgroundColor: red.red4,
        color: red.red11,
        '&:hover': { backgroundColor: red.red5 },
      },
      mauve: {
        backgroundColor: mauve.mauve4,
        color: mauve.mauve11,
        '&:hover': { backgroundColor: mauve.mauve5 },
      },
    },
  },

  defaultVariants: {
    variant: 'violet',
  },
});
