import * as cover from '@mapbox/tile-cover';
import { useThree } from '@react-three/fiber';
import { Meta } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { latLngToCell } from 'h3-js';
import { useState } from 'react';
import json from '../__fixtures/world.json';
import { withCanvasSetup } from '../__stories/CanvasSetup';
import { withTrpcClient } from '../__stories/withTrpcClient';
import { HexMap } from './hex-map.component';
import { createHexMapMachine } from './hex-map.machine';
// var poly = JSON.parse(fs.readFileSync('./poly.geojson'));

// console.log(tiles(json as any, { max_zoom: 15, min_zoom: 5 }));

export default {
  component: HexMap,
  decorators: [withTrpcClient, withCanvasSetup],
} as Meta;

// const originLatLng = [21.33823, -158.124891];

const StoryComponent = () => {
  const camera = useThree((state) => state.camera);

  const limits = {
    min_zoom: 4,
    max_zoom: 9,
  };
  // console.log(cover.tiles(json as any, limits));
  // cover.tiles(json as any, limits);

  // const query = trpc.tile.gridDisk.useQuery({ res: 3, lat: 19, lng: -155 });

  // useFrame((state) => {
  // trpc.tile.gridDisk.useQuery()
  // console.log(state.camera.position.y);
  // });

  const res = 15;
  const indexAtOrigin = latLngToCell(-15, 155, res);

  const [machine] = useState(createHexMapMachine(camera, indexAtOrigin));
  const actor = useInterpret(machine);

  return <HexMap actor={actor} />;
};

export const Primary = {
  render: () => <StoryComponent />,
  parameters: {
    layout: 'fullscreen',
  },
};
