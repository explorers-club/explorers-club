import { ComponentStory, Meta } from '@storybook/react';
import { contentfulClient } from '@explorers-club/contentful';
import { MultipleAnswerHostPreviewComponent } from './multiple-answer-host-preview.component';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { MULTIPLE_ANSWER_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: MultipleAnswerHostPreviewComponent,
  decorators: [withCardDecorator],
  argTypes: {
    onContinue: { action: 'continue' },
  },
} as Meta;

export const Primary: ComponentStory<
  typeof MultipleAnswerHostPreviewComponent
> = (args, { loaded }) => {
  return <MultipleAnswerHostPreviewComponent {...args} {...loaded} />;
};

Primary.args = {
  responsesByPlayerName: {
    Teddy: ['Meeks', 'Lu'],
    Inspector: ['Cat'],
    Jamba: undefined,
  },
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
