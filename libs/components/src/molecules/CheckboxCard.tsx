import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Box } from '../atoms';
import { Flex } from '../atoms/Flex';
import { CSS, styled } from '../stitches.config';

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

const CheckboxContainer = styled(Flex, {
  width: '$5',
  height: '$5',
  borderRadius: '$1',
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

      [`& ${CheckboxContainer}`]: {
        border: '1px solid $slate8',
      },
    },
  },
  '&[data-state="checked"]': {
    boxShadow:
      'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8 !important',
    [`& ${StyledToggleIndicator}`]: {
      transform: 'scale(1)',
    },

    [`& ${CheckboxContainer}`]: {
      border: '1px solid $blue8',
      color: 'white',
    },
  },
  [`& ${CheckboxContainer}`]: {
    border: '1px solid $slate7',
  },
});

type CheckboxRootPrimitiveProps = React.ComponentProps<typeof Checkbox.Root>;
type CheckboxCardProps = CheckboxRootPrimitiveProps & { css?: CSS };

export const CheckboxCard = React.forwardRef<
  React.ElementRef<typeof StyledCheckboxRoot>,
  CheckboxCardProps
>((props, forwardedRef) => (
  <StyledCheckboxRoot {...props} ref={forwardedRef}>
    <Flex align="center" css={{ width: '100%' }} justify="between">
      {props.children}
      <CheckboxContainer justify="center" align="center">
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </CheckboxContainer>
    </Flex>
  </StyledCheckboxRoot>
));
