import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { CodebreakersConfigurationScreenComponent } from './codebreakers-configuration-screen.component';

export default { component: CodebreakersConfigurationScreenComponent } as Meta;

export const Primary: ComponentStory<
  typeof CodebreakersConfigurationScreenComponent
> = (args) => {
  return <CodebreakersConfigurationScreenComponent />;
};
