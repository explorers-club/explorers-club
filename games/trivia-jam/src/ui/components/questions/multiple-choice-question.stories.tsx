import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MULTIPLE_CHOICE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { contentfulClient } from '@explorers-club/contentful';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

const meta = {
  component: MultipleChoiceQuestionComponent,
  decorators: [withCardDecorator],
  argTypes: { onSubmitResponse: { action: 'submitted' } },
} as ComponentMeta<typeof MultipleChoiceQuestionComponent>;

export const Primary: ComponentStory<typeof MultipleChoiceQuestionComponent> = (
  args,
  { loaded }
) => {
  return <MultipleChoiceQuestionComponent {...args} {...loaded} />;
};

Primary.loaders = [
  async () => ({
    fields: (
      await contentfulClient.getEntry<IMultipleChoiceFields>(
        MULTIPLE_CHOICE_SAMPLE_ENTRY_ID
      )
    ).fields,
  }),
];

export default meta;
