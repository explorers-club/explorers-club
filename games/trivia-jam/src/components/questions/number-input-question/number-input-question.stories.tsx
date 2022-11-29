import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NumberInputQuestion } from './number-input-question.component';

const meta = {
  component: NumberInputQuestion,
} as ComponentMeta<typeof NumberInputQuestion>;

const Template: ComponentStory<typeof NumberInputQuestion> = (args) => {
  return <NumberInputQuestion {...args} />;
};

export const BasicExample = Template.bind({});

BasicExample.args = {
  question: 'Black bears are the best bears',
};

export default meta;
