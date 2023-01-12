import { Box } from './Box';
import { Grid } from './Grid';
import { Text } from './Text';

export default {
  component: Grid,
};

export const Default = () => (
  <Grid
    css={{
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '$7',
    }}
  >
    <Box>
      <Text as="p" size="4" css={{ lineHeight: '27px' }}>
        This is a much shorter paragraph of text, to demonstrate narrow text
        container. The reason we're using text here is because one common use
        case for this container size is a 3-up grid.
      </Text>
    </Box>
    <Box>
      <Text as="p" size="4" css={{ lineHeight: '27px' }}>
        This is a much shorter paragraph of text, to demonstrate narrow text
        container. The reason we're using text here is because one common use
        case for this container size is a 3-up grid.
      </Text>
    </Box>
    <Box>
      <Text as="p" size="4" css={{ lineHeight: '27px' }}>
        This is a much shorter paragraph of text, to demonstrate narrow text
        container. The reason we're using text here is because one common use
        case for this container size is a 3-up grid.
      </Text>
    </Box>
  </Grid>
);
