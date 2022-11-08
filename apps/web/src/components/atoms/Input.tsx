import { styled } from '@stitches/react';
import { violet } from '@radix-ui/colors';

export const Input = styled('input', {
  all: 'unset',
//   width: '100%',
//   display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
//   flex: '1',
  borderRadius: 4,
  padding: '0 10px',
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  boxShadow: `0 0 0 1px ${violet.violet7}`,
  height: 25,

  '&:focus': { boxShadow: `0 0 0 2px ${violet.violet8}` },
});
