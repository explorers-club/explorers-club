import { trpc } from '@explorers-club/api-client';
import { bboxToTile, pointToTileFraction, tileToBBOX } from '@mapbox/tilebelt';
import { Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { h3SetToMultiPolygonFeature } from 'geojson2h3';
import {
  cellToLatLng,
  cellToParent,
  getResolution,
  gridDisk,
  gridDistance,
  latLngToCell,
} from 'h3-js';
import { FC, useContext, useMemo, useRef, useState } from 'react';
import { ActorRef } from 'xstate';
import { HexMapContext } from './hex-map.context';
import { useHexagonScatterAtIndex } from './hex-map.hooks';
import { HexMapEvent, HexMapState } from './hex-map.machine';
import { fromLatLngToPoint } from './hex-map.utils';
import { HexTerrain } from './hex-terrain.component';

interface Props {
  actor: ActorRef<HexMapEvent, HexMapState>;
}

// grabbed from https://github.com/mapbox/mapbox-gl-native/issues/11621
const UNIT_LENGTH_LATITUDE = 898.2987;
const UNIT_LENGTH_LONGITUDE = 1072.9588;

const MAP_WIDTH = UNIT_LENGTH_LONGITUDE * 360;
const MAP_HEIGHT = UNIT_LENGTH_LATITUDE * 180;

export const HexMap: FC<Props> = ({ actor }) => {
  const visibleChunks = useSelector(
    actor,
    (state) => state.context.visibleChunks
  );

  useMemo(() => {
    const primeMeridian = latLngToCell(0, 0, 0);
    const wholeWorld = gridDisk(primeMeridian, 10); // radius 10 on res 0 covers whole world (122)

    console.log('geoJson1');
    console.log({ MAP_WIDTH, MAP_HEIGHT });
    const geoJson = h3SetToMultiPolygonFeature(wholeWorld);

    // const tiles = cover.tiles(geoJson.geometry, { min_zoom: 0, max_zoom: 0 });
    // console.log('geoJson', geoJson, tiles, tiles.map(tileToBBOX));
    console.log('bbox', bboxToTile([-180, -90, 180, 90]));
    const globalTile = bboxToTile([-180, -90, 180, 90]);
    console.log(globalTile, tileToBBOX(globalTile));

    // const primeMeridianTile = pointToTile(0, 0, 0);
    const primeMeridianTileFraction = pointToTileFraction(0, 0, 0);
    console.log({ primeMeridianTileFraction });

    // console.log(projector.lngToX(-180, 1), projector.latToY(-89, 1));
    // console.log(projector.lngToX(-21, 1), projector.latToY(45, 1));
    // tiles[0];
    // const tiles = cover.tiles(geoJson.geometry, { max_zoom: 12, min_zoom: 4 });
    // console.log(tiles);
    // tiles.map((tile) =>
    //   console.log('bbox', tile, tileToBBOX(tile), tileToQuadkey(tile))
    // );
    return geoJson;
  }, []);

  return (
    <HexMapContext.Provider value={actor}>
      {visibleChunks.map((h3Index) => {
        return <HexChunk h3Index={h3Index} key={h3Index} />;
      })}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        args={[MAP_WIDTH, MAP_HEIGHT, 1024, 1024]}
      >
        <meshStandardMaterial color="aqua" />
      </Plane>
    </HexMapContext.Provider>
  );
};

interface ChunkProps {
  h3Index: string;
}

const getLod = (distance: number) => {
  return 4 - distance;
};

const HexChunk: FC<ChunkProps> = ({ h3Index }) => {
  const actor = useContext(HexMapContext);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const indexAtOrigin = actor.getSnapshot()!.context.indexAtOrigin;
  const chunkRes = getResolution(h3Index);
  const indexAtOriginParent = cellToParent(indexAtOrigin, chunkRes);
  const initialDistance = gridDistance(h3Index, indexAtOriginParent);
  const [lod, setLod] = useState(getLod(initialDistance));
  const lodRef = useRef(lod);

  useFrame(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const distance = gridDistance(h3Index, indexAtOriginParent);

    const newLod = getLod(distance);
    if (lodRef.current !== newLod) {
      setLod(newLod);
      lodRef.current = newLod;
    }
  });

  const tiles = trpc.tile.byIndex.useQuery({ h3Index, lod }).data?.tiles;
  const points = useHexagonScatterAtIndex(h3Index, lod);

  const [lat, lng] = cellToLatLng(h3Index);
  const point = fromLatLngToPoint(lat, lng);
  console.log(point, lat, lng);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0 + Math.random()]}>
      <HexTerrain points={points} lod={lod} tiles={tiles} />
    </group>
  );
};
