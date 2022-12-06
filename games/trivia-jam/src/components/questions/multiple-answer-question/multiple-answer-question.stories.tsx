import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MultipleAnswerQuestionComponent } from './multiple-answer-question.component';

const meta = {
  component: MultipleAnswerQuestionComponent,
  argTypes: { onSubmitResponse: { action: 'submitted' } },
} as ComponentMeta<typeof MultipleAnswerQuestionComponent>;

const Template: ComponentStory<typeof MultipleAnswerQuestionComponent> = (
  args
) => {
  return <MultipleAnswerQuestionComponent {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  prompt: 'What are the best bears',
  answers: [
    'Black Bear',
    'Teddy',
    'Koala Bears',
    'Gizzly Bears',
    'Polar Bears',
    'Panda Bears',
  ],
};

export default meta;
