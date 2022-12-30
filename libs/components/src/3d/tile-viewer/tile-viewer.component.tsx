import { Plane } from '@react-three/drei';
import { FC } from 'react';
import { resDistanceMap } from './tile-viewer.constants';
import { TileViewerActor } from './tile-viewer.machine';

interface Props {
  actor: TileViewerActor;
}
export const TileViewer: FC<Props> = ({ actor }) => {
  // what do I need to ultimately render...
  // hexagons
  // what i need is an elevation and terrain type
  // my inputs are a... resolution and ring size and a current location

  //  current location is a lat long and a resolution
  // trpc.tile.gridDisk(5)
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
