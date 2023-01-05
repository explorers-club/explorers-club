import { Meta } from '@storybook/react';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { TreeModel } from './tree.component';

export default {
  component: TreeModel,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Default = () => {
  return <TreeModel />;
};
