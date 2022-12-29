import { Plane } from '@react-three/drei';
import { FC } from 'react';
import { resDistanceMap } from './tile-viewer.constants';
import { TileViewerActor } from './tile-viewer.machine';

interface Props {
  actor: TileViewerActor;
}
export const TileViewer: FC<Props> = ({ actor }) => {
  console.log(actor);
  return <Water />;
};

const Water = () => {
  return (
    <Plane
      rotation={[-Math.PI / 2, 0, 0]}
      args={[resDistanceMap[15], resDistanceMap[15]]}
    >
      <meshBasicMaterial color="aqua" />
    </Plane>
  );
};
