import { contentfulClient } from '@explorers-club/contentful';
import { ComponentStory, Meta } from '@storybook/react';
import { IMultipleAnswerFields } from '../../../../../../libs/contentful/@types/generated/contentful';
import { MULTIPLE_CHOICE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { MultipleChoiceHostPreviewComponent } from './multiple-choice-host-preview.component';

export default {
  component: MultipleChoiceHostPreviewComponent,
  argTypes: {
    onContinue: { action: 'continue' },
  },
} as Meta;

export const Primary: ComponentStory<
  typeof MultipleChoiceHostPreviewComponent
> = (args, { loaded }) => {
  return <MultipleChoiceHostPreviewComponent {...args} {...loaded} />;
};

Primary.args = {
  responsesByPlayerName: {
    Teddy: 'Meeks',
    Inspector: 'Lu',
    Jamba: undefined,
  },
};

Primary.loaders = [
  async () => ({
    fields: (
      await contentfulClient.getEntry<IMultipleAnswerFields>(
        MULTIPLE_CHOICE_SAMPLE_ENTRY_ID
      )
    ).fields,
  }),
];
