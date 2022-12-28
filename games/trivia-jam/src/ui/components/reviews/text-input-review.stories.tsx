import { ComponentStory, Meta } from '@storybook/react';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { TextInputReviewComponent } from './text-input-review.component';
import { contentfulClient } from '@explorers-club/contentful';
import { TEXT_INPUT_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';

export default { component: TextInputReviewComponent } as Meta;

export const Primary: ComponentStory<typeof TextInputReviewComponent> = (
  args,
  { loaded }
) => {
  return <TextInputReviewComponent {...loaded} {...args} />;
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
