import React from 'react';
import { Text } from './Text';
import { VariantProps, CSS } from '../stitches.config';
import merge from 'lodash.merge';

const DEFAULT_TAG = 'span';

type CaptionSizeVariants = '1' | '2';
type CaptionVariants = { size?: CaptionSizeVariants } & Omit<
  VariantProps<typeof Text>,
  'size'
>;
type CaptionProps = React.ComponentProps<typeof DEFAULT_TAG> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CaptionVariants & { css?: CSS; as?: any };

export const Caption = React.forwardRef<
  React.ElementRef<typeof DEFAULT_TAG>,
  CaptionProps
>((props, forwardedRef) => {
  // '2' here is the default Caption size variant
  // 'pink' is the default color variant
  const { size = '1', variant = 'low_contrast', ...textProps } = props;

  // This is the mapping of Caption Variants to Text css
  const textCss: Record<CaptionSizeVariants, CSS> = {
    1: {
      fontWeight: 'bold',
      fontSize: '10px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    2: {
      fontWeight: 'bold',
      fontSize: '12px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  };

  const css = merge(textCss[size], props.css);

  return (
    <Text
      as={DEFAULT_TAG}
      {...textProps}
      variant={variant}
      ref={forwardedRef}
      css={css}
    />
  );
});
