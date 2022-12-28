import { contentfulClient } from '@explorers-club/contentful';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TRUE_OR_FALSE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { TrueOrFalseQuestionComponent } from './true-or-false-question.component';

const meta = {
  component: TrueOrFalseQuestionComponent,
  argTypes: { onSubmitResponse: { action: 'submitted' } },
} as ComponentMeta<typeof TrueOrFalseQuestionComponent>;

export const Primary: ComponentStory<typeof TrueOrFalseQuestionComponent> = (
  args,
  { loaded }
) => {
  return <TrueOrFalseQuestionComponent {...args} {...loaded} />;
};

Primary.loaders = [
  async () => ({
    fields: (
      await contentfulClient.getEntry<ITrueOrFalseFields>(
        TRUE_OR_FALSE_SAMPLE_ENTRY_ID
      )
    ).fields,
  }),
];

export default meta;
