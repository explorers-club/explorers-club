import { ComponentStory, Meta } from '@storybook/react';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { TrueOrFalseReviewComponent } from './true-or-false-review.component';
import { contentfulClient } from '@explorers-club/contentful';
import { TRUE_OR_FALSE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: TrueOrFalseReviewComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof TrueOrFalseReviewComponent> = (
  args,
  { loaded }
) => {
  return <TrueOrFalseReviewComponent {...loaded} {...args} />;
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
