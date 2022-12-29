// import { Args } from '@storybook/api';
import { Meta } from '@storybook/react';
import { TileViewer } from './tile-viewer.component';
import { withCanvasSetup } from '../__stories/CanvasSetup';

export default {
  component: TileViewer,
  decorators: [withCanvasSetup],
} as Meta;

const ComponentStory = () => {
  return <TileViewer />;
};

export const Default = {
  render: () => <ComponentStory />,
};
