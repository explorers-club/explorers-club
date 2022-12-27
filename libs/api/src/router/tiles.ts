import { cellsToMultiPolygon, polygonToCells } from 'h3-js';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const tileRouter = router({
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
  polygonToCells: publicProcedure
    .input(
      z.object({
        polygon: z.array(z.array(z.number())),
        res: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      const cells = polygonToCells(input.polygon, input.res);
      const coordinates = cellsToMultiPolygon(cells, true);
      return { cells, coordinates };
    }),
});
