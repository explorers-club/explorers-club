import {
  cellToChildren,
  cellToLatLng,
  getResolution,
  gridDisk,
  latLngToCell,
} from 'h3-js';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

export const tileRouter = router({
  byIndex: publicProcedure
    .input(
      z.object({
        h3Index: z.string(), // todo validate against h3 parse function
        lod: z.number().min(1).max(4),
        // limit: z.number().min(1).max(3000).default(3000),
        // cursor: z.number().nullish(),
      })
    )
    .query(({ input }) => {
      const { h3Index, lod } = input;

      const res = getResolution(h3Index);

      const indexes = cellToChildren(h3Index, res + lod);

      const tiles = indexes.map((h3Index) => {
        const [lat, lng] = cellToLatLng(h3Index);
        const elevation = noise2D(lat, lng);
        // todo add terrain type here based off elevation
        return { h3Index, lat, lng, elevation };
      });

      return {
        tiles,
      };
    }),
  allCells: publicProcedure
    .input(
      z.object({
        res: z.number().min(0).max(15),
        limit: z.number().min(1).max(3000).default(3000),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(({ ctx, input }) => {
      const { cursor, limit } = input;
      // const limit = input.limit ?? 50;
      // const { cursor } = input;
      // todo use cursor
      const items: { lat: number; lng: number }[] = [];
      for (let i = 0; i < limit; i++) {
        items.push({
          lat: (Math.random() - 0.5) * 180 * 0.9,
          lng: ((Math.random() - 0.5) * 360) / 1,
        });
      }

      // const items = await prisma.post.findMany({
      //   take: limit + 1, // get an extra item at the end which we'll use as next cursor
      //   where: {
      //     title: {
      //       contains: 'Prisma' /* Optional filter */,
      //     },
      //   },
      //   cursor: cursor ? { myCursor: cursor } : undefined,
      //   orderBy: {
      //     myCursor: 'asc',
      //   },
      // });

      const nextCursor: typeof cursor | undefined = undefined;
      // if (items.length > limit) {
      //   const nextItem = items.pop();
      //   nextCursor = nextItem!.myCursor;
      // }

      return {
        items,
        nextCursor,
      };
    }),
  gridDisk: publicProcedure
    .input(
      z.object({
        // tilesetId: z.string().default('earth'),
        res: z.number().min(0).max(15),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        radius: z.number().min(1).max(40).default(20),
      })
    )
    .query(({ input }) => {
      const { res, lat, lng, radius } = input;

      const h3Index = latLngToCell(lat, lng, res);
      const disk = gridDisk(h3Index, radius);

      const tiles = disk.map((h3Index) => {
        const [lat, lng] = cellToLatLng(h3Index);
        const elevation = noise2D(lat, lng);
        // todo add terrain type here based off elevation
        return { h3Index, lat, lng, elevation };
      });

      return {
        tiles,
      };
    }),
});
