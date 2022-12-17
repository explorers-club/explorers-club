import { z } from 'zod';
// could use z.custom here https://github.com/colinhacks/zod#custom-schemas
// to add validation
// export type ClubRoomID = `club-${string}`;
// export type TriviaJamRoomID = `trivia_jam-${string}`;
// export type DiffusionaryRoomID = `diffusionary-${string}`;

// export type RoomID = ClubRoomID | TriviaJamRoomID | DiffusionaryRoomID;

export const ClubRoomIdSchema = z.custom<`club-${string}`>((val) => {
  return /^club-\w+$/.test(val as string);
});
export const TriviaJamRoomIdSchema = z.custom<`trivia_jam-${string}`>((val) => {
  return /^trivia_jam-\w+$/.test(val as string);
});
export const DiffusionaryRoomIdSchema = z.custom<`diffusionary-${string}`>(
  (val) => {
    return /^diffusionary-\w+$/.test(val as string);
  }
);

export type ClubRoomId = z.infer<typeof ClubRoomIdSchema>;
export type TriviaJamRoomId = z.infer<typeof TriviaJamRoomIdSchema>;
export type DiffusionaryRoomId = z.infer<typeof DiffusionaryRoomIdSchema>;

export type RoomId = ClubRoomId | TriviaJamRoomId | DiffusionaryRoomId;
