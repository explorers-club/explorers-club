import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { styled, CSS } from '../../stitches.config';
import { CheckIcon } from '@radix-ui/react-icons';

// export const ToggleCardGroup = styled(ToggleGroupPrimitive.Root, {
//   display: 'block',
// });

// const StyledToggleButton = styled('div', {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   borderRadius: '$round',
//   width: 25,
//   height: 25,
//   boxShadow: 'inset 0 0 0 1px $colors$slate7',
//   flexShrink: 0,
//   mr: '$3',
// });

const StyledToggleIndicator = styled('div', {
  borderRadius: '$round',
  width: 15,
  height: 15,
  backgroundColor: '$blue9',
  transform: 'scale(0)',
});

const StyledCheckboxRoot = styled(Checkbox.Root, {
  all: 'unset',
  boxSizing: 'border-box',
  userSelect: 'none',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  display: 'flex',
  alignItems: 'center',
  borderRadius: '$2',
  boxShadow: 'inset 0 0 0 1px $colors$slate7',
  p: '$3',
  '@hover': {
    '&:hover': {
      boxShadow: 'inset 0 0 0 1px $colors$slate8',
    },
  },
  '&[data-state="checked"]': {
    boxShadow:
      'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8 !important',
    [`& ${StyledToggleIndicator}`]: {
      transform: 'scale(1)',
    },
  },
});

type CheckboxRootPrimitiveProps = React.ComponentProps<typeof Checkbox.Root>;
type CheckboxCardProps = CheckboxRootPrimitiveProps & { css?: CSS };

export const CheckboxCard = React.forwardRef<
  React.ElementRef<typeof StyledCheckboxRoot>,
  CheckboxCardProps
>((props, forwardedRef) => (
  <StyledCheckboxRoot {...props} ref={forwardedRef}>
    <Checkbox.Indicator className="CheckboxIndicator">
      <CheckIcon />
    </Checkbox.Indicator>
    {props.children}
    {/* <StyledToggleButton>
      <StyledToggleIndicator />
    </StyledToggleButton>
    {props.children} */}
  </StyledCheckboxRoot>
));
