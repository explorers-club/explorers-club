import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { MultipleAnswerReviewComponent } from './multiple-answer-review.component';
import { contentfulClient } from '@explorers-club/contentful';
import { MULTIPLE_ANSWER_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';

export default { component: MultipleAnswerReviewComponent } as Meta;

export const Primary: ComponentStory<typeof MultipleAnswerReviewComponent> = (
  args,
  { loaded }
) => {
  return <MultipleAnswerReviewComponent {...loaded} {...args} />;
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
