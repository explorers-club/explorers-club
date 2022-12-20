import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TrueOrFalseQuestionComponent } from './true-or-false-question.component';

const meta = {
  component: TrueOrFalseQuestionComponent,
  argTypes: { onSubmitResponse: { action: 'submitted ' } },
} as ComponentMeta<typeof TrueOrFalseQuestionComponent>;

const Template: ComponentStory<typeof TrueOrFalseQuestionComponent> = (
  args
) => {
  return <TrueOrFalseQuestionComponent {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  prompt: 'Black bears are the best bears',
};

export default meta;
