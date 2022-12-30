import { Container } from './Container';
import { Sup } from './Sup';

import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Sup,
} as ComponentMeta<typeof Sup>;

export const Default: ComponentStory<typeof Sup> = (props) => (
  <Container size="4" css={{ height: '$9', background: '$amber5' }}>
    <Sup {...props}>The quick brown fox jumped over the lazy dog</Sup>
  </Container>
);
