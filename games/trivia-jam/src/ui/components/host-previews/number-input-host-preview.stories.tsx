import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NumberInputHostPreviewComponent } from './number-input-host-preview.component';

export default { component: NumberInputHostPreviewComponent } as Meta;

export const Primary: ComponentStory<typeof NumberInputHostPreviewComponent> = (
  args
) => {
  return <NumberInputHostPreviewComponent />;
};
