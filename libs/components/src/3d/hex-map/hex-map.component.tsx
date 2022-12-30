import { trpc } from '@explorers-club/api-client';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { cellToLatLng } from 'h3-js';
import { FC } from 'react';
import { ActorRef } from 'xstate';
import { Terrain } from '../terrain';
import { HexMapEvent, HexMapState } from './hex-map.machine';

interface Props {
  actor: ActorRef<HexMapEvent, HexMapState>;
}

export const HexMap: FC<Props> = ({ actor }) => {
  const visibleChunks = useSelector(
    actor,
    (state) => state.context.visibleChunks
  );
  console.log({ visibleChunks });

  return (
    <>
      {visibleChunks.map((h3Index) => {
        return <HexChunk h3Index={h3Index} key={h3Index} />;
      })}
    </>
  );
};

interface ChunkProps {
  h3Index: string;
}

const HexChunk: FC<ChunkProps> = ({ h3Index }) => {
  const [lat, lng] = cellToLatLng(h3Index);
  // const camera = useThree((state) => state.camera);

  useFrame((state) => {
    // calculate distance between camera and the chunk
    // state.camera.position
  });
  // calculate lod based off distance from camera
  const res = 3; // should be
  const query = trpc.tile.gridDisk.useQuery({ res, lat, lng });

  if (!query.data) {
    // todo placeholder
    return null;
  }

  // todo calculate the hex geometry from here..
  return <Terrain />;
};
