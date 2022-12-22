import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { MultipleChoiceReviewComponent } from './multiple-choice-review.component';
import { contentfulClient } from '@explorers-club/contentful';
import { MULTIPLE_CHOICE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';

export default { component: MultipleChoiceReviewComponent } as Meta;

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
