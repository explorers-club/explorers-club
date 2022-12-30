import { Box } from './Box';
import { Text } from './Text';
import { Section } from './Section';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Section,
} as ComponentMeta<typeof Section>;

export const Default: ComponentStory<typeof Section> = (props) => (
  <Box>
    <Section size="1" css={{ background: '$primary4', mb: '$2' }}>
      <Text> Section size 1</Text>
    </Section>
    <Section size="2" css={{ background: '$primary4', mb: '$2' }}>
      <Text> Section size 2</Text>
    </Section>
    <Section size="3" css={{ background: '$primary4', mb: '$2' }}>
      <Text> Section size 3</Text>
    </Section>
  </Box>
);
