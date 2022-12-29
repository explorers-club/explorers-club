import { trpc } from '@explorers-club/api-client';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { useMemo } from 'react';
import { Grid, useHelper } from '@react-three/drei';
import { Terrain } from '../terrain';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraHelper } from 'three';

/**
 * Maps a camera zoom to an h3 resolution
 * @param zoom
 */
const getResolution = (zoom: number) => {
  if (zoom < 4) {
    return 0;
  } else if (zoom < 8) {
    return 1;
  } else if (zoom < 16) {
    return 2;
  } else if (zoom < 32) {
    return 3;
  } else if (zoom < 64) {
    return 4;
  } else if (zoom < 128) {
    return 5;
  } else {
    return 6;
  }
};

const worldPolygon = [
  [-180, -85],
  [180, -85],
  [180, 85],
  [-180, 85],
];

// const polygon = [
//   [37.813318999983238, -122.4089866999972145],
//   [37.7198061999978478, -122.3544736999993603],
//   [37.8151571999998453, -122.4798767000009008],
// ];

export const HexMap = () => {
  const tileQuery = trpc.tile.polygonToCells.useQuery({
    polygon: worldPolygon,
    res: 2,
  });

  const geometry = useMemo(() => {
    const coordinates = tileQuery.data?.coordinates;
    if (coordinates) {
      const geo = new GeoJsonGeometry({ type: 'MultiPolygon', coordinates });
      return geo;
    }
    return null;
  }, [tileQuery.data]);

  useFrame((state, delta, xFrame) => {
    const res = getResolution(state.camera.zoom);
    const { x, z } = state.camera.position;
    console.log(res);
    // X, Z -> lat long
  });

  return (
    <>
      <Terrain />
      <Grid infiniteGrid={true} followCamera />
    </>
  );
};
