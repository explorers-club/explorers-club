import { Container } from './Container';
import { Text } from './Text';
import { Heading } from './Heading';

export default {
  component: Container,
};

export const Default = {
  render: () => (
    <Container css={{ backgroundColor: '$panel2', mb: '$2' }}>
      <Heading css={{ mb: '$2' }}>Default Container</Heading>
      <Text size="4">Works like a div that contains other components</Text>
    </Container>
  ),
};
export const Sizes = {
  render: () => (
    <Container>
      <Container size="1" css={{ backgroundColor: '$panel2', mb: '$2' }}>
        <Heading size="2" css={{ mb: '$3' }}>
          Size 3
        </Heading>
        <Text size="6">Max 430px</Text>
      </Container>
      <Container size="2" css={{ backgroundColor: '$panel2', mb: '$2' }}>
        <Heading size="2" css={{ mb: '$3' }}>
          Size 2
        </Heading>
        <Text size="6">Max 715px</Text>
      </Container>
      <Container size="3" css={{ backgroundColor: '$panel2', mb: '$2' }}>
        <Heading size="2" css={{ mb: '$3' }}>
          Size 3
        </Heading>
        <Text size="6">Max 1145px</Text>
      </Container>
      <Container size="4" css={{ backgroundColor: '$panel2', mb: '$2' }}>
        <Heading size="2" css={{ mb: '$3' }}>
          Size 4
        </Heading>
        <Text size="6">Full Width (Default)</Text>
      </Container>
    </Container>
  ),
};
