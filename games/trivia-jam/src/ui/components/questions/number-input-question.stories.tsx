import { contentfulClient } from '@explorers-club/contentful';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NUMBER_INPUT_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { NumberInputQuestionComponent } from './number-input-question.component';

const meta = {
  component: NumberInputQuestionComponent,
  argTypes: { onSubmitResponse: { action: 'submitted' } },
} as ComponentMeta<typeof NumberInputQuestionComponent>;

export const Primary: ComponentStory<typeof NumberInputQuestionComponent> = (
  args,
  { loaded }
) => {
  return <NumberInputQuestionComponent {...args} {...loaded} />;
};

Primary.loaders = [
  async () => ({
    fields: (
      await contentfulClient.getEntry<INumberInputFields>(
        NUMBER_INPUT_SAMPLE_ENTRY_ID
      )
    ).fields,
  }),
];

export default meta;
