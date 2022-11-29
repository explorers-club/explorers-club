import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MultipleAnswerQuestion } from './multiple-answer-question.component';

const meta = {
  component: MultipleAnswerQuestion,
} as ComponentMeta<typeof MultipleAnswerQuestion>;

const Template: ComponentStory<typeof MultipleAnswerQuestion> = (args) => {
  return <MultipleAnswerQuestion {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  question: 'Black bears are the best bears',
};

export default meta;
