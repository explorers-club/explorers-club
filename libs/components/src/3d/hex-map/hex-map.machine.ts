import {
  cellToLatLng,
  cellToParent,
  getResolution,
  gridDisk
} from 'h3-js';
import { Camera, Vector3 } from 'three';
import { ActorRefFrom, assign, createMachine, StateFrom } from 'xstate';

export type HexMapEvent = { type: 'CHANGE_RESOLUTION' };

export type HexMapContext = {
  visibleChunks: string[];
  indexAtOrigin: string;
};

const resDistanceMap: Record<number, number> = {
  15: 2,
  14: 4,
  13: 8,
  12: 16,
  11: 32,
  10: 64,
  9: 128,
  8: 256,
  7: 512,
  6: 1024,
  5: 2048,
  4: 4096,
  3: 8192,
  // 2: 16384,
  // 1: 32768,
  // 0: 65536,
};

const getTargetResolution = (cameraPosition: Vector3) => {
  const resDistances = Object.entries(resDistanceMap);

  let i = 0;
  do {
    const [res, distance] = resDistances[i];

    if (cameraPosition.y < distance) {
      return parseInt(res);
    }
  } while (i++ < resDistances.length);

  // max out at 3, because we always step up to the great-grandparent hex
  // to fetch neighbors
  return 3;
};

export const createHexMapMachine = (camera: Camera, indexAtOrigin: string) =>
  createMachine({
    id: 'HexMapMachine',
    initial: 'Initializing',
    context: {
      visibleChunks: [],
      indexAtOrigin,
    },
    schema: {
      context: {} as HexMapContext,
      events: {} as HexMapEvent,
    },
    states: {
      Initializing: {
        always: [
          {
            // actions: assign<HexMapContext>({
            //   visibleChunks: () => []
            // })
            // actions: assign({
            //   visibleChunks: () => {
            //     const res = getTargetResolution(camera.position);
            //     const cell = latLngToCell(
            //       INIT_POSITION.lat,
            //       INIT_POSITION.lng,
            //       res
            //     );
            //     return [];

            //     // const allIndexes: Record<
            //     //   string,
            //     //   { h3Index: string; lod: number }
            //     // > = {};

            //     // // Near range indexes
            //     // gridDisk(cell, 1).forEach((h3Index) => {
            //     //   allIndexes[h3Index] = { h3Index, lod: 5 };
            //     // });

            //     // // Add mid-range indexes, lod 3
            //     // gridDisk(cell, 3).forEach((h3Index) => {
            //     //   if (allIndexes[h3Index]) {
            //     //     return;
            //     //   }
            //     //   allIndexes[h3Index] = { h3Index, lod: 3 };
            //     // });

            //     // // Add far-range indexes, lod 1
            //     // gridDisk(cell, 10).forEach((h3Index) => {
            //     //   if (allIndexes[h3Index]) {
            //     //     return;
            //     //   }
            //     //   allIndexes[h3Index] = { h3Index, lod: 1 };
            //     // });

            //     // return Array.from(Object.values(allIndexes));
            //   },
            // }),
            actions: assign<HexMapContext, HexMapEvent>({
              visibleChunks: () => {
                // const [lat, lng] = cellToLatLng(indexAtOrigin);
                const [lat, lng] = cellToLatLng(indexAtOrigin);

                const res = getResolution(indexAtOrigin);
                const ancestor = cellToParent(indexAtOrigin, res - 4);

                const toRender = gridDisk(ancestor, 3);

                // const indexes = toRender.flatMap((value) => {

                // })
                // console.log(toRender);

                // console.log(lat, lng, camera.position);

                // const res = getTargetResolution(camera.position);
                // const cell = latLngToCell(
                //   INIT_POSITION.lat,
                //   INIT_POSITION.lng,
                //   res
                // );

                // const parent = cellToParent(cell, res - 3);

                return toRender;
              },
            }),
            target: 'Initialized',
          },
        ],
      },
      Initialized: {},
    },
  });

export type HexMapMachine = ReturnType<typeof createHexMapMachine>;
export type HexMapActor = ActorRefFrom<HexMapMachine>;
export type HexMapState = StateFrom<HexMapMachine>;
