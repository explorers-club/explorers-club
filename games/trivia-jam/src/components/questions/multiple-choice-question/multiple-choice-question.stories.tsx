import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MultipleChoiceQuestion } from './multiple-choice-question.component';

const meta = {
  component: MultipleChoiceQuestion,
} as ComponentMeta<typeof MultipleChoiceQuestion>;

const Template: ComponentStory<typeof MultipleChoiceQuestion> = (args) => {
  return <MultipleChoiceQuestion {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  question: 'What kind of bear is best?',
  correctAnswer: 'Black bear',
  incorrectAnswers: ['Grizzly bear', 'Panda bear', 'Koala bear'],
};

export default meta;
