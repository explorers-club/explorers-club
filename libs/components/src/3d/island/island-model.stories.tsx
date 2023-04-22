import { withCanvasSetup } from '../__stories/CanvasSetup';
import { IslandModel } from './island-model.component';

export default {
  component: IslandModel,
  decorators: [withCanvasSetup],
};

export const Primary = () => {
  return <IslandModel />;
};
