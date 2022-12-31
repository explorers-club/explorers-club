import { contentfulClient } from '@explorers-club/contentful';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import { ComponentStory, Meta } from '@storybook/react';
import { MULTIPLE_CHOICE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { MultipleChoiceReviewComponent } from './multiple-choice-review.component';

export default {
  component: MultipleChoiceReviewComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof MultipleChoiceReviewComponent> = (
  args,
  { loaded }
) => {
  return <MultipleChoiceReviewComponent {...loaded} {...args} />;
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
