import { Meta } from '@storybook/react';
import { Vector3 } from 'three';
import { CanvasSetup } from '../__stories/CanvasSetup';
import { Tree } from './tree.component';
import { PalmTreeModel } from './palm-tree-model.component';

export default {
  component: Tree,
  decorators: [
    (Story) => (
      <CanvasSetup>
        <Story />
      </CanvasSetup>
    ),
  ],
} as Meta;

export const Default = () => {
  return <Tree />;
};

export const PalmTree = () => {
  return <PalmTreeModel />;
};
