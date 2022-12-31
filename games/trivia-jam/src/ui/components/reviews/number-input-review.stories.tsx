import { ComponentStory, Meta } from '@storybook/react';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { NumberInputReviewComponent } from './number-input-review.component';
import { contentfulClient } from '@explorers-club/contentful';
import { NUMBER_INPUT_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: NumberInputReviewComponent,
  decorators: [withCardDecorator],
} as Meta;

export const Primary: ComponentStory<typeof NumberInputReviewComponent> = (
  args,
  { loaded }
) => {
  return <NumberInputReviewComponent {...loaded} {...args} />;
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
