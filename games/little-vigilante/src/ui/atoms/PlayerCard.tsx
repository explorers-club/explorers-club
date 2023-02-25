import { Heading } from '@atoms/Heading';
import { colorBySlotNumber, styled } from '@explorers-club/styles';
import { ComponentProps, forwardRef } from 'react';

export const PlayerCard = forwardRef<
  any,
  { slotNumber: number } & ComponentProps<typeof Card>
>(({ slotNumber, ...props }, ref) => {
  const color = colorBySlotNumber[slotNumber];
  return <Card ref={ref} color={color} {...props} />;
});

export const PlayerName = forwardRef<
  any,
  { slotNumber: number } & ComponentProps<typeof Heading>
>(({ slotNumber, ...props }, ref) => {
  const color = colorBySlotNumber[slotNumber];
  return <Heading ref={ref} css={{  color: `$${color}11`}} {...props} />;
});

// const PlayerAvatar = forwardRef<any, ComponentProps<typeof Heading></typeof>

// todo port back to global card
// temporarily copy-pasta'd
const Card = styled('div', {
  appearance: 'none',
  // border: 'none',
  boxSizing: 'border-box',
  font: 'inherit',
  lineHeight: '1',
  outline: 'none',
  overflow: 'hidden',
  padding: 0,
  textAlign: 'inherit',
  verticalAlign: 'middle',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

  backgroundColor: '$panel1',
  border: 'none',
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
  flexShrink: 0,
  position: 'relative',
  borderRadius: '$3',

  variants: {
    //     inactive: {
    //       true: {
    //         opacity: 0.15,
    //       },
    //     },
    variant: {
      interactive: {
        border: '1px solid $border1',
        cursor: 'pointer',
        // boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)',
        '@hover': {
          '&:hover': {
            boxShadow: '$shadow5',
            '&::before': {
              // boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)',
            },
          },
        },
        '&:focus': {
          '&::before': {
            // boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8',
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        transition:
          'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 25ms linear',
        willChange: 'transform',
        '&::before': {
          boxShadow:
            '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
          opacity: '0',
          transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        },
        '@hover': {
          '&:hover': {
            backgroundColor: '$panel',
            transform: 'translateY(-2px)',
            '&::before': {
              opacity: '1',
            },
          },
        },
        '&:active': {
          transform: 'translateY(0)',
          transition: 'none',
          '&::before': {
            boxShadow:
              '0px 5px 16px -5px rgba(22, 23, 24, 0.35), 0px 5px 10px -7px rgba(22, 23, 24, 0.2)',
            opacity: '1',
          },
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8',
        },
      },
      active: {
        transform: 'translateY(0)',
        transition: 'none',
        '&::before': {
          boxShadow:
            '0px 5px 16px -5px rgba(22, 23, 24, 0.35), 0px 5px 10px -7px rgba(22, 23, 24, 0.2)',
          opacity: '1',
        },
        '&:focus': {
          boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8',
        },
      },
    },
  },
});
