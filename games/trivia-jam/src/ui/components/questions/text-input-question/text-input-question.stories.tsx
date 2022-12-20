import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextInputQuestionComponent } from './text-input-question.component';

const meta = {
  component: TextInputQuestionComponent,
  argTypes: { onSubmitResponse: { action: 'submitted ' } },
} as ComponentMeta<typeof TextInputQuestionComponent>;

const Template: ComponentStory<typeof TextInputQuestionComponent> = (args) => {
  return <TextInputQuestionComponent {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  prompt: 'Black bears are the best bears',
};

export default meta;
