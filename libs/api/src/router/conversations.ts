import { ConversationInfoResponseSchema } from '@explorers-club/chat';
import {
  cellToChildren,
  cellToLatLng,
  getResolution,
  gridDisk,
  latLngToCell,
} from 'h3-js';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const conversationsRouter = router({
  info: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
      })
    )
    .output(ConversationInfoResponseSchema)
    .query(({ input }) => {
      return { ok: false, error: 'There was an error' };
    }),
  //   history: publicProcedure
  //     .input(
  //       z.object({
  //         // tilesetId: z.string().default('earth'),
  //         res: z.number().min(0).max(15),
  //         lat: z.number().min(-90).max(90),
  //         lng: z.number().min(-180).max(180),
  //         radius: z.number().min(1).max(40).default(20),
  //       })
  //     )
  //     .query(({ input }) => {
  //       const { res, lat, lng, radius } = input;

  //       const h3Index = latLngToCell(lat, lng, res);
  //       const disk = gridDisk(h3Index, radius);

  //       const tiles = disk.map((h3Index) => {
  //         const [lat, lng] = cellToLatLng(h3Index);
  //         const elevation = noise2D(lat, lng);
  //         // todo add terrain type here based off elevation
  //         return { h3Index, lat, lng, elevation };
  //       });

  //       return {
  //         tiles,
  //       };
  //     }),
});
