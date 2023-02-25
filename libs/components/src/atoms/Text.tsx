import { styled } from '../stitches.config';

export const Text = styled('span', {
  // Reset
  lineHeight: '1',
  margin: '0',
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  display: 'block',

  variants: {
    size: {
      '1': {
        fontSize: '$1',
      },
      '2': {
        fontSize: '$2',
      },
      '3': {
        fontSize: '$3',
      },
      '4': {
        fontSize: '$4',
      },
      '5': {
        fontSize: '$5',
        letterSpacing: '-.015em',
      },
      '6': {
        fontSize: '$6',
        letterSpacing: '-.016em',
      },
      '7': {
        fontSize: '$7',
        letterSpacing: '-.031em',
        textIndent: '-.005em',
      },
      '8': {
        fontSize: '$8',
        letterSpacing: '-.034em',
        textIndent: '-.018em',
      },
      '9': {
        fontSize: '$9',
        letterSpacing: '-.055em',
        textIndent: '-.025em',
      },
    },
    variant: {
      primary: {
        color: '$primary9',
      },
      secondary: {
        color: '$secondary9',
      },
      warning: {
        color: '$warning9',
      },
      success: {
        background: '$success9',
      },
      error: {
        background: '$error9',
      },
      contrast: {
        color: '$neutral12',
      },
      low_contrast: {
        color: '$neutral11',
      },
      gray: {
        color: '$slate9',
      },
      red: {
        color: '$red9',
      },
      crimson: {
        color: '$crimson9',
      },
      pink: {
        color: '$pink9',
      },
      purple: {
        color: '$purple9',
      },
      violet: {
        color: '$violet9',
      },
      indigo: {
        color: '$indigo9',
      },
      blue: {
        color: '$blue9',
      },
      cyan: {
        color: '$cyan9',
      },
      teal: {
        color: '$teal9',
      },
      green: {
        color: '$green9',
      },
      lime: {
        color: '$lime9',
      },
      yellow: {
        color: '$yellow9',
      },
      orange: {
        color: '$orange9',
      },
      brown: {
        color: '$brown9',
      },
      amber: {
        color: '$amber9',
      },
      gold: {
        color: '$gold9',
      },
      bronze: {
        color: '$bronze9',
      },
    },
    gradient: {
      true: {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    },
  },
  defaultVariants: {
    size: '3',
    variant: 'contrast',
  },
});
