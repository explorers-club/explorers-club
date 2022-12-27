import { cellsToMultiPolygon, polygonToCells } from 'h3-js';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const tileRouter = router({
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
