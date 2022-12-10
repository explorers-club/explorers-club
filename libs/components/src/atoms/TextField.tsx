import { styled } from '../stitches.config';

export const TextField = styled('input', {
  // Reset
  appearance: 'none',
  borderWidth: '0',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  margin: '0',
  outline: 'none',
  padding: '0',
  // WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },

  // Custom
  backgroundColor: '$primary3',
  border: '$primary6',
  borderStyle: 'solid',
  // boxShadow: 'inset 0 0 0 1px $colors$slate7',
  color: '$neutral12',
  fontVariantNumeric: 'tabular-nums',

  '&:-webkit-autofill': {},

  '&:-webkit-autofill::first-line': {},

  '&:focus': {
    backgroundColor: '$primary4',
    borderColor: '$primary7',
    // boxShadow:
    //   'inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$blue8',
    // '&:-webkit-autofill': {
    //   boxShadow:
    //     'inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$blue8, inset 0 0 0 100px $colors$blue3',
    // },
  },
  '&::placeholder': {
    color: '$neutral11',
    // color: '$slate9',
  },
  '&:disabled': {},
  '&:read-only': {},

  variants: {
    size: {
      '1': {
        borderRadius: '$1',
        height: '$6',
        fontSize: '$2',
        px: '$1',
        lineHeight: '$sizes$5',
        '&:-webkit-autofill::first-line': {
          fontSize: '$2',
        },
      },
      '2': {
        borderRadius: '$2',
        height: '$7',
        fontSize: '$4',
        px: '$2',
        lineHeight: '$sizes$6',
        '&:-webkit-autofill::first-line': {
          fontSize: '$4',
        },
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    variant: {
      // ghost: {
      //   boxShadow: 'none',
      //   backgroundColor: 'transparent',
      //   '@hover': {
      //     '&:hover': {
      //       boxShadow: 'inset 0 0 0 1px $colors$slateA7',
      //     },
      //   },
      //   '&:focus': {
      //     backgroundColor: '$loContrast',
      //     boxShadow:
      //       'inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$blue8',
      //   },
      //   '&:disabled': {
      //     backgroundColor: 'transparent',
      //   },
      //   '&:read-only': {
      //     backgroundColor: 'transparent',
      //   },
      // },
    },
    state: {
      invalid: {
        boxShadow: 'inset 0 0 0 1px $colors$red7',
        '&:focus': {
          boxShadow:
            'inset 0px 0px 0px 1px $colors$red8, 0px 0px 0px 1px $colors$red8',
        },
      },
      valid: {
        boxShadow: 'inset 0 0 0 1px $colors$green7',
        '&:focus': {
          boxShadow:
            'inset 0px 0px 0px 1px $colors$green8, 0px 0px 0px 1px $colors$green8',
        },
      },
    },
    cursor: {
      default: {
        cursor: 'default',
        '&:focus': {
          cursor: 'text',
        },
      },
      text: {
        cursor: 'text',
      },
    },
  },
  defaultVariants: {
    size: '2',
    fullWidth: true,
  },
});
