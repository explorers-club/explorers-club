import { Container } from './Container';
import { Text } from './Text';
import { Heading } from './Heading';

export default {
  component: Container,
};

export const Default = {
  render: () => (
    <Container css={{ backgroundColor: '$panel2' }}>
      <Text size="6">Default Container</Text>
      <Text size="4">Works like a div that contains other components</Text>
    </Container>
  ),
};
export const Sizes = {
  render: () => (
    <Container>
      <Heading size="2" css={{ mt: '$5', mb: '$3' }}>
        Size 1
      </Heading>
      <Container size="1" css={{ backgroundColor: '$panel2' }}>
        <Text size="6">Max 430px</Text>
        <Text size="4">Works like a div that contains other components</Text>
      </Container>
      <Heading size="2" css={{ mt: '$5', mb: '$3' }}>
        Size 2
      </Heading>
      <Container size="2" css={{ backgroundColor: '$panel2' }}>
        <Text size="6">Max 715px</Text>
        <Text size="4">Works like a div that contains other components</Text>
      </Container>
      <Heading size="2" css={{ mt: '$5', mb: '$3' }}>
        Size 3
      </Heading>
      <Container size="3" css={{ backgroundColor: '$panel2' }}>
        <Text size="6">Max 1145px</Text>
        <Text size="4">Works like a div that contains other components</Text>
      </Container>
      <Heading size="2" css={{ mt: '$5', mb: '$3' }}>
        Size 4
      </Heading>
      <Container size="4" css={{ backgroundColor: '$panel2' }}>
        <Text size="6">Full Width (Default)</Text>
        <Text size="4">Works like a div that contains other components</Text>
      </Container>
    </Container>
  ),
};
