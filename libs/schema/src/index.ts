import { z } from 'zod';
import { TriviaJamState } from '../@types/generated/TriviaJamState';
import { DiffusionaryState } from '../@types/generated/DiffusionaryState';
import { LittleVigilanteState } from '../@types/generated/LittleVigilanteState';
import { CodebreakersState } from '../@types/generated/CodebreakersState';

export const ClubRoomIdSchema = z.custom<`club-${string}`>((val) => {
  return /^club-\w+$/.test(val as string);
});
export const TriviaJamRoomIdSchema = z.custom<`trivia_jam-${string}`>((val) => {
  return /^trivia_jam-\w+$/.test(val as string);
});
export const CodebreakersRoomIdSchema = z.custom<`codebreakers-${string}`>(
  (val) => {
    return /^codebreakers-\w+$/.test(val as string);
  }
);
export const DiffusionaryRoomIdSchema = z.custom<`diffusionary-${string}`>(
  (val) => {
    return /^diffusionary-\w+$/.test(val as string);
  }
);
export const LittleVigilanteRoomIdSchema =
  z.custom<`little_vigilante-${string}`>((val) => {
    return /^little_vigilante-\w+$/.test(val as string);
  });

export type ClubRoomId = z.infer<typeof ClubRoomIdSchema>;
export type TriviaJamRoomId = z.infer<typeof TriviaJamRoomIdSchema>;
export type DiffusionaryRoomId = z.infer<typeof DiffusionaryRoomIdSchema>;
export type LittleVigilanteRoomId = z.infer<typeof LittleVigilanteRoomIdSchema>;
export type CodebreakersRoomId = z.infer<typeof CodebreakersRoomIdSchema>;

export type GameState =
  | TriviaJamState
  | DiffusionaryState
  | LittleVigilanteState
  | CodebreakersState;

export type GameRoomId =
  | TriviaJamRoomId
  | DiffusionaryRoomId
  | LittleVigilanteRoomId
  | CodebreakersRoomId;

export type RoomId = ClubRoomId | GameRoomId;

export type ClubMetadata = {
  clubName: string;
};
