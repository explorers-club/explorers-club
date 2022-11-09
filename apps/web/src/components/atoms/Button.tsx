import { styled } from '../../styles';

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
  textAlign: 'center',

  variants: {
    variant: {
      primary: {
        backgroundColor: "$accent9",
        color: "white",
        '&:hover': { backgroundColor: "$neutral3" },
        '&:disabled': { backgroundColor: "$neutral3" },
      },
      success: {
        backgroundColor: "$success9",
        color: "white",
        '&:hover': { backgroundColor: "$neutral3" },
        '&:disabled': { backgroundColor: "$neutral3" },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
});
