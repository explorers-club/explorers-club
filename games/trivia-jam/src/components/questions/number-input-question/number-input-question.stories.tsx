import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NumberInputQuestionComponent } from './number-input-question.component';

const meta = {
  component: NumberInputQuestionComponent,
} as ComponentMeta<typeof NumberInputQuestionComponent>;

const Template: ComponentStory<typeof NumberInputQuestionComponent> = (
  args
) => {
  return <NumberInputQuestionComponent {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  prompt: 'Black bears are the best bears',
};

export default meta;
