import { contentfulClient } from '@explorers-club/contentful';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TEXT_INPUT_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { TextInputQuestionComponent } from './text-input-question.component';

const meta = {
  component: TextInputQuestionComponent,
  argTypes: { onSubmitResponse: { action: 'submitted' } },
} as ComponentMeta<typeof TextInputQuestionComponent>;

export const Primary: ComponentStory<typeof TextInputQuestionComponent> = (
  args,
  { loaded }
) => {
  return <TextInputQuestionComponent {...args} {...loaded} />;
};

Primary.loaders = [
  async () => ({
    fields: (
      await contentfulClient.getEntry<ITextInputFields>(
        TEXT_INPUT_SAMPLE_ENTRY_ID
      )
    ).fields,
  }),
];

export default meta;
