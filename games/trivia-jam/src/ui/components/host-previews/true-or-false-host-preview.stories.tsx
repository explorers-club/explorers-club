import { contentfulClient } from '@explorers-club/contentful';
import { ComponentStory, Meta } from '@storybook/react';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { TRUE_OR_FALSE_SAMPLE_ENTRY_ID } from '../../../../.storybook/trivia-jam-story-data';
import { TrueOrFalseHostPreviewComponent } from './true-or-false-host-preview.component';
import { withCardDecorator } from '@storybook-decorators/CardDecorator';

export default {
  component: TrueOrFalseHostPreviewComponent,
  decorators: [withCardDecorator],
  argTypes: {
    onContinue: { action: 'continue' },
  },
} as Meta;

export const Primary: ComponentStory<typeof TrueOrFalseHostPreviewComponent> = (
  args,
  { loaded }
) => {
  return <TrueOrFalseHostPreviewComponent {...args} {...loaded} />;
};

Primary.args = {
  responsesByPlayerName: {
    Teddy: true,
    Inspector: false,
    Jamba: undefined,
  },
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
