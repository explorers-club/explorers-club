import { contentfulClient } from '@explorers-club/contentful';
import { ComponentStory, Meta } from '@storybook/react';
import { TriviaJamConfigSerialized } from '@explorers-club/room';
import { TriviaJamConfigurationScreenComponent } from './trivia-jam-configuration-screen.component';

export default {
  component: TriviaJamConfigurationScreenComponent,
  argTypes: {
    onSubmitConfig: { action: 'submit' },
  },
} as Meta;

export const Primary: ComponentStory<
  typeof TriviaJamConfigurationScreenComponent
> = (args, { loaded }) => {
  return <TriviaJamConfigurationScreenComponent {...args} {...loaded} />;
};

Primary.args = {
  initialConfig: {
    questionSetEntryId: 'dSX6kC0PNliXTl7qHYJLH',
  } as TriviaJamConfigSerialized,
};

Primary.loaders = [
  async () => ({
    questionSetEntries: (
      await contentfulClient.getEntries({
        content_type: 'questionSet',
      })
    ).items,
  }),
];
