import { styled } from '../stitches.config';

export const Button = styled('button', {
  // Reset
  all: 'unset',
  alignItems: 'center',
  boxSizing: 'border-box',
  userSelect: 'none',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },

  // Custom reset?
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
  lineHeight: '1',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',

  // Custom
  height: '$5',
  px: '$2',
  fontFamily: '$untitled',
  fontSize: '$2',
  fontWeight: 'bold',
  fontVariantNumeric: 'tabular-nums',

  '&:disabled': {
    backgroundColor: '$neutral2',
    boxShadow: 'inset 0 0 0 1px $colors$neutral7',
    color: '$neutral8',
    pointerEvents: 'none',
  },

  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    size: {
      '1': {
        borderRadius: '$1',
        height: '$5',
        px: '$2',
        fontSize: '$1',
        lineHeight: '$sizes$5',
      },
      '2': {
        borderRadius: '$2',
        height: '$6',
        px: '$3',
        fontSize: '$3',
        lineHeight: '$sizes$6',
      },
      '3': {
        borderRadius: '$2',
        height: '$7',
        px: '$4',
        fontSize: '$4',
        lineHeight: '$sizes$7',
      },
    },
    color: {
      neutral: {
        backgroundColor: '$neutral2',
        boxShadow: 'inset 0 0 0 1px $colors$neutral7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
        },
        '&:active': {
          backgroundColor: '$neutral2',
          boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$neutral8, 0 0 0 1px $colors$neutral8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$neutral4',
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
      },
      primary: {
        backgroundColor: '$primary3',
        border: '2px solid $border1',
        color: '$primary9',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$blue8',
          },
        },
        '&:active': {
          backgroundColor: '$blue3',
          boxShadow: 'inset 0 0 0 1px $colors$blue8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$blue4',
            boxShadow: 'inset 0 0 0 1px $colors$blue8',
          },
      },
      green: {
        backgroundColor: '$green2',
        boxShadow: 'inset 0 0 0 1px $colors$green7',
        color: '$green11',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$green8',
          },
        },
        '&:active': {
          backgroundColor: '$green3',
          boxShadow: 'inset 0 0 0 1px $colors$green8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$green8, 0 0 0 1px $colors$green8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$green4',
            boxShadow: 'inset 0 0 0 1px $colors$green8',
          },
      },
      red: {
        backgroundColor: '$loContrast',
        boxShadow: 'inset 0 0 0 1px $colors$neutral7',
        color: '$error11',
        '@hover': {
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
        },
        '&:active': {
          backgroundColor: '$error3',
          boxShadow: 'inset 0 0 0 1px $colors$error8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$error8, 0 0 0 1px $colors$error8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$error4',
            boxShadow: 'inset 0 0 0 1px $colors$error8',
          },
      },
      transparentWhite: {
        backgroundColor: 'hsla(0,100%,100%,.2)',
        boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        color: 'white',
        '@hover': {
          '&:hover': {
            backgroundColor: 'hsla(0,100%,100%,.25)',
          },
        },
        '&:active': {
          backgroundColor: 'hsla(0,100%,100%,.3)',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px hsla(0,100%,100%,.35), 0 0 0 1px hsla(0,100%,100%,.35)',
        },
      },
      transparentBlack: {
        backgroundColor: 'hsla(0,0%,0%,.2)',
        color: 'black',
        '@hover': {
          '&:hover': {
            backgroundColor: 'hsla(0,0%,0%,.25)',
          },
        },
        '&:active': {
          backgroundColor: 'hsla(0,0%,0%,.3)',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px hsla(0,0%,0%,.35), 0 0 0 1px hsla(0,0%,0%,.35)',
        },
      },
    },
    state: {
      active: {
        backgroundColor: '$neutral4',
        boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        color: '$neutral11',
        '@hover': {
          '&:hover': {
            backgroundColor: '$neutral5',
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
        },
        '&:active': {
          backgroundColor: '$neutral5',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$neutral8, 0 0 0 1px $colors$neutral8',
        },
      },
      waiting: {
        backgroundColor: '$neutral4',
        boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        color: 'transparent',
        pointerEvents: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$neutral5',
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
        },
        '&:active': {
          backgroundColor: '$neutral5',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        },
      },
    },
    ghost: {
      true: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
  },
  compoundVariants: [
    {
      color: 'gray',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$neutralA3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$neutralA4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$neutralA8, 0 0 0 1px $colors$neutralA8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$neutralA4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'blue',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$blueA3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$blueA4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$blueA8, 0 0 0 1px $colors$blueA8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$blueA4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'green',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$greenA3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$greenA4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$greenA8, 0 0 0 1px $colors$greenA8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$greenA4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'red',
      ghost: 'true',
      css: {
        backgroundColor: 'transparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$errorA3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$errorA4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$errorA8, 0 0 0 1px $colors$errorA8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$errorA4',
            boxShadow: 'none',
          },
      },
    },
  ],
  defaultVariants: {
    size: '1',
    color: 'neutral',
  },
});
