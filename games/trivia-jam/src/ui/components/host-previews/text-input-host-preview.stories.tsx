import { ComponentStory, Meta } from '@storybook/react';
import { TEXT_INPUT_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { contentfulClient } from '@explorers-club/contentful';
import { TextInputHostPreviewComponent } from './text-input-host-preview.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: TextInputHostPreviewComponent,
  decorators: [withCardDecorator],
  argTypes: {
    onContinue: { action: 'continue' },
  },
} as Meta;

export const Primary: ComponentStory<typeof TextInputHostPreviewComponent> = (
  args,
  { loaded }
) => {
  return <TextInputHostPreviewComponent {...args} {...loaded} />;
};

Primary.args = {
  responsesByPlayerName: {
    Teddy: 'Key West',
    Inspector: 'Miami',
    Jamba: undefined,
  },
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
