import { Caption } from './Caption';
import { Box } from './Box';
import { Heading } from './Heading';
import { Text } from './Text';

export default {
  component: Caption,
};

export const Default = {
  render: () => (
    <Box>
      <Caption>Default Caption</Caption>
    </Box>
  ),
};
export const Components = {
  render: () => (
    <Box>
      <Heading css={{ mb: '$3' }}>paragraph</Heading>
      <Caption as="p">paragraph</Caption>
      <Heading css={{ mt: '$6', mb: '$3' }}>Caption</Heading>
      <Caption as="caption">Table Caption</Caption>
      <Heading css={{ mt: '$6', mb: '$3' }}>Link ({'<a>'} tag)</Heading>
      <Caption as="a">Link {'<a>'} </Caption>
    </Box>
  ),
};
export const Sizes = {
  render: () => (
    <Box>
      <Heading css={{ mb: '$3' }}>Sizes</Heading>
      <Caption size="1" css={{ mb: '$3' }}>
        Size 1
      </Caption>

      <Caption size="2" css={{ mb: '$3' }}>
        Size 2
      </Caption>
    </Box>
  ),
};
export const Variants = {
  render: () => (
    <Box>
      <Heading css={{ mb: '$3' }}>Variants</Heading>

      <Caption variant="contrast" css={{ mb: '$3' }}>
        Contrast
      </Caption>
      <Caption variant="low_contrast" css={{ mb: '$3' }}>
        Low contrast
      </Caption>
    </Box>
  ),
};
export const Gradient = {
  render: () => (
    <Box>
      <Heading css={{ mb: '$3' }}>Gradient</Heading>

      <Caption gradient="true" css={{ mb: '$3' }}>
        Gradient
      </Caption>

      <Caption css={{ mb: '$3' }}>No Gradient</Caption>
    </Box>
  ),
};
