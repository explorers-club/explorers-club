import { trpc } from '@explorers-club/api-client';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { useMemo } from 'react';

const polygon = [
  [37.813318999983238, -122.4089866999972145],
  [37.7198061999978478, -122.3544736999993603],
  [37.8151571999998453, -122.4798767000009008],
];

export const HexMap = () => {
  const tileQuery = trpc.tile.polygonToCells.useQuery({
    polygon,
    res: 7,
  });

  const geometry = useMemo(() => {
    const coordinates = tileQuery.data?.coordinates;
    if (coordinates) {
      const geo = new GeoJsonGeometry({ type: 'MultiPolygon', coordinates });
      return geo;
    }
    return null;
  }, [tileQuery.data]);

  console.log(tileQuery.data, geometry);

  return null;
};
