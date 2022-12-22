import { contentfulClient } from '@explorers-club/contentful';
import { ComponentStory, Meta } from '@storybook/react';
import { INumberInputFields } from '../../../../../../libs/contentful/@types/generated/contentful';
import { NUMBER_INPUT_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { NumberInputHostPreviewComponent } from './number-input-host-preview.component';

export default {
  component: NumberInputHostPreviewComponent,
  argTypes: {
    onContinue: { action: 'continue' },
  },
} as Meta;

export const Primary: ComponentStory<typeof NumberInputHostPreviewComponent> = (
  args,
  { loaded }
) => {
  return <NumberInputHostPreviewComponent {...args} {...loaded} />;
};

Primary.args = {
  responsesByPlayerName: {
    Teddy: 128,
    Inspector: 37,
    Jamba: undefined,
  },
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
