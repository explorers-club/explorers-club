import React from 'react';
import { Text } from './Text';
import { VariantProps, CSS } from '../../stitches.config';
import merge from 'lodash.merge';

const DEFAULT_TAG = 'h1';

type TextSizeVariants = Pick<VariantProps<typeof Text>, 'size'>;
type SubheadingSizeVariants = '1' | '2' | '3' | '4';
type SubheadingVariants = { size?: SubheadingSizeVariants } & Omit<
  VariantProps<typeof Text>,
  'size'
>;
type HeadingProps = React.ComponentProps<typeof DEFAULT_TAG> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SubheadingVariants & { css?: CSS; as?: any };

export const Subheading = React.forwardRef<
  React.ElementRef<typeof DEFAULT_TAG>,
  HeadingProps
>((props, forwardedRef) => {
  // '2' here is the default Subheading size variant
  const { size = '1', ...textProps } = props;
  // This is the mapping of Subheading Variants to Text variants
  const textSize: Record<SubheadingSizeVariants, TextSizeVariants['size']> = {
    1: { '@initial': '1' },
    2: { '@initial': '2' },
    3: { '@initial': '3' },
    4: { '@initial': '4' },
  };

  // This is the mapping of Subheading Variants to Text css
  const textCss: Record<SubheadingSizeVariants, CSS> = {
    1: {
      lineHeight: '125%',
    },
    2: {
      lineHeight: '125%',
    },
    3: {
      lineHeight: '125%',
    },
    4: {
      lineHeight: '125%',
    },
  };
  const css = merge(textCss[size], props.css, {
    fontVariantNumeric: 'proportional-nums',
  });

  return (
    <Text
      as={DEFAULT_TAG}
      {...textProps}
      ref={forwardedRef}
      size={textSize[size]}
      css={css}
    />
  );
});
