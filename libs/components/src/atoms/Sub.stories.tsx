import { Container } from './Container';
import { Sub } from './Sub';

import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Sub,
} as ComponentMeta<typeof Sub>;

export const Default: ComponentStory<typeof Sub> = (props) => (
  <Container size="4" css={{ height: '$9', background: '$amber5' }}>
    <Sub {...props}>The quick brown fox jumped over the lazy dog</Sub>
  </Container>
);
