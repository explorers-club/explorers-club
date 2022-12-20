import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TrueOrFalseHostPreviewComponent } from './true-or-false-host-preview.component';

export default { component: TrueOrFalseHostPreviewComponent } as Meta;

export const Primary: ComponentStory<typeof TrueOrFalseHostPreviewComponent> = (
  args
) => {
  return <TrueOrFalseHostPreviewComponent />;
};
