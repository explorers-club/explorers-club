import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MULTIPLE_ANSWER_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { IMultipleAnswerFields } from '../../../../../../libs/contentful/@types/generated/contentful';
import { contentfulClient } from '@explorers-club/contentful';
import { MultipleAnswerQuestionComponent } from './multiple-answer-question.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

const meta = {
  component: MultipleAnswerQuestionComponent,
  decorators: [withCardDecorator],
  argTypes: { onSubmitResponse: { action: 'submitted' } },
} as ComponentMeta<typeof MultipleAnswerQuestionComponent>;

export const Primary: ComponentStory<typeof MultipleAnswerQuestionComponent> = (
  args,
  { loaded }
) => {
  return <MultipleAnswerQuestionComponent {...args} {...loaded} />;
};

Primary.loaders = [
  async () => ({
    fields: (
      await contentfulClient.getEntry<IMultipleAnswerFields>(
        MULTIPLE_ANSWER_SAMPLE_ENTRY_ID
      )
    ).fields,
  }),
];

export default meta;
