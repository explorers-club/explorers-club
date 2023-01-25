import { GetComponentProps } from '@explorers-club/utils';
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
      primary: {
        backgroundColor: '$primary3',
        boxShadow: 'inset 0 0 0 1px $colors$primary7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$primary4',
            boxShadow: 'inset 0 0 0 1px $colors$primary8',
          },
        },
        '&:active': {
          backgroundColor: '$primary5',
          boxShadow: 'inset 0 0 0 1px $colors$primary8',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$primary7, 0 0 0 1px $colors$primary7',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$primary4',
            boxShadow: 'inset 0 0 0 1px $colors$primary7',
          },
      },
      secondary: {
        backgroundColor: '$secondary3',
        boxShadow: 'inset 0 0 0 1px $colors$secondary7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$secondary4',
            boxShadow: 'inset 0 0 0 1px $colors$secondary8',
          },
        },
        '&:active': {
          backgroundColor: '$secondary5',
          boxShadow: 'inset 0 0 0 1px $colors$secondary8',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$secondary8, 0 0 0 1px $colors$secondary8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$secondary4',
            boxShadow: 'inset 0 0 0 1px $colors$secondary8',
          },
      },

      neutral: {
        backgroundColor: '$neutral3',
        boxShadow: 'inset 0 0 0 1px $colors$neutral7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$neutral4',
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
        },
        '&:active': {
          backgroundColor: '$neutral5',
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

      error: {
        backgroundColor: '$error3',
        boxShadow: 'inset 0 0 0 1px $colors$error7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$error4',
            boxShadow: 'inset 0 0 0 1px $colors$error8',
          },
        },
        '&:active': {
          backgroundColor: '$error5',
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

      success: {
        backgroundColor: '$success3',
        boxShadow: 'inset 0 0 0 1px $colors$success7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$success4',
            boxShadow: 'inset 0 0 0 1px $colors$success8',
          },
        },
        '&:active': {
          backgroundColor: '$success5',
          boxShadow: 'inset 0 0 0 1px $colors$success8',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$success8, 0 0 0 1px $colors$success8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$success4',
            boxShadow: 'inset 0 0 0 1px $colors$success8',
          },
      },

      warning: {
        backgroundColor: '$warning3',
        boxShadow: 'inset 0 0 0 1px $colors$warning7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$warning4',
            boxShadow: 'inset 0 0 0 1px $colors$warning8',
          },
        },
        '&:active': {
          backgroundColor: '$warning5',
          boxShadow: 'inset 0 0 0 1px $colors$warning8',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$warning8, 0 0 0 1px $colors$warning8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$warning4',
            boxShadow: 'inset 0 0 0 1px $colors$warning8',
          },
      },

      info: {
        backgroundColor: '$info3',
        boxShadow: 'inset 0 0 0 1px $colors$info7',
        color: '$hiContrast',
        '@hover': {
          '&:hover': {
            backgroundColor: '$info5',
            boxShadow: 'inset 0 0 0 1px $colors$info8',
          },
        },
        '&:active': {
          backgroundColor: '$info5',
          boxShadow: 'inset 0 0 0 1px $colors$info8',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$info8, 0 0 0 1px $colors$info8',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$info4',
            boxShadow: 'inset 0 0 0 1px $colors$info8',
          },
      },
    },
    state: {
      active: {
        backgroundColor: '$neutral4',
        boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        color: '$loContrast',
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
        backgroundColor: '$neutral3',
        boxShadow: 'inset 0 0 0 1px $colors$neutral8',
        color: '$loContrast',
        pointerEvents: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$neutral3',
            boxShadow: 'inset 0 0 0 1px $colors$neutral8',
          },
        },
        '&:active': {
          backgroundColor: '$neutral3',
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
      color: 'neutral',
      ghost: true,
      css: {
        backgroundColor: 'transparent',
        color: '$hiContrast',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$neutral3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$neutral4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$neutral8, 0 0 0 1px $colors$neutral5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$neutral4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'primary',
      ghost: true,
      css: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$primary3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$primary4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$primary8, 0 0 0 1px $colors$primary5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$primary4',
            boxShadow: 'none',
          },
      },
    },
    {
      ghost: true,
      color: 'secondary',
      css: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$secondary3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$secondary4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$secondary8, 0 0 0 1px $colors$secondary5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$secondary4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'error',
      ghost: true,
      css: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$error3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$error4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$error8, 0 0 0 1px $colors$error5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$error4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'warning',
      ghost: true,
      css: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$warning3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$warningerror4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$warning8, 0 0 0 1px $colors$warning5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$warning4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'info',
      ghost: true,
      css: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$info3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$info4',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$info8, 0 0 0 1px $colors$info5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$info4',
            boxShadow: 'none',
          },
      },
    },
    {
      color: 'success',
      ghost: true,
      css: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '@hover': {
          '&:hover': {
            backgroundColor: '$success3',
            boxShadow: 'none',
          },
        },
        '&:active': {
          backgroundColor: '$success4',
        },
        '&:focus': {
          boxShadow:
            'inset 0 0 0 1px $colors$success8, 0 0 0 1px $colors$success5',
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: '$success4',
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

/**
 * 
primary
secondary
neutral
error
info
warning
success
 */

export type ButtonProps = GetComponentProps<typeof Button>;