import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextInputQuestion } from './text-input-question.component';

const meta = {
  component: TextInputQuestion,
} as ComponentMeta<typeof TextInputQuestion>;

const Template: ComponentStory<typeof TextInputQuestion> = (args) => {
  return <TextInputQuestion {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  question: 'Black bears are the best bears',
};

export default meta;
