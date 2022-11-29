import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TrueFalseQuestion } from './true-false-question.component';

const meta = {
  component: TrueFalseQuestion,
} as ComponentMeta<typeof TrueFalseQuestion>;

const Template: ComponentStory<typeof TrueFalseQuestion> = (args) => {
  return <TrueFalseQuestion {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  question: 'Black bears are the best bears',
};

export default meta;
