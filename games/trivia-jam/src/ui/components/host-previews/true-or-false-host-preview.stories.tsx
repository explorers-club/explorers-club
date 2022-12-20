import { ComponentStory, Meta } from '@storybook/react';
import { TrueOrFalseHostPreviewComponent } from './true-or-false-host-preview.component';

export default {
  component: TrueOrFalseHostPreviewComponent,
  argTypes: {
    onContinue: { action: 'continue ' },
  },
} as Meta;

export const Primary: ComponentStory<typeof TrueOrFalseHostPreviewComponent> = (
  args
) => {
  return <TrueOrFalseHostPreviewComponent {...args} />;
};

Primary.args = {
  prompt: 'What kind of bear is best?',
};
