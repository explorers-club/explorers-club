import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TextInputHostPreviewComponent } from './text-input-host-preview.component';

export default { component: TextInputHostPreviewComponent } as Meta;

export const Primary: ComponentStory<typeof TextInputHostPreviewComponent> = (
  args
) => {
  return <TextInputHostPreviewComponent />;
};
