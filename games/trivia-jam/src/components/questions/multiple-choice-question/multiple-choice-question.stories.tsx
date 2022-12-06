import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question.component';

const meta = {
  component: MultipleChoiceQuestionComponent,
} as ComponentMeta<typeof MultipleChoiceQuestionComponent>;

const Template: ComponentStory<typeof MultipleChoiceQuestionComponent> = (
  args
) => {
  return <MultipleChoiceQuestionComponent {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  prompt: 'What kind of bear is best?',
  answers: ['Black bear', 'Grizzly bear', 'Sunbear', 'Koala', 'Teddy'],
};

export default meta;
