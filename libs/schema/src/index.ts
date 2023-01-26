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

export const TriviaJamConfigSchema = z.object({
  gameId: z.literal('trivia_jam').default('trivia_jam'),
  maxPlayers: z.number().max(20).default(20),
  questionSetEntryId: z.string().default('dSX6kC0PNliXTl7qHYJLH'),
});

export type TriviaJamConfig = z.infer<typeof TriviaJamConfigSchema>;

export const DiffusionaryConfigSchema = z.object({
  gameId: z.literal('diffusionary').default('diffusionary'),
  maxPlayers: z.number().max(10).default(10),
});

export type DiffusionaryConfig = z.infer<typeof DiffusionaryConfigSchema>;

export const LittleVigilanteConfigSchema = z.object({
  gameId: z.literal('little_vigilante').default('little_vigilante'),
  maxPlayers: z.number().max(10).default(10),
  discussionTimeSeconds: z.number().default(300),
  votingTimeSeconds: z.number().default(10),
});

export type LittleVigilanteConfig = z.infer<typeof LittleVigilanteConfigSchema>;

export const CodebreakersConfigSchema = z.object({
  gameId: z.literal('codebreakers').default('codebreakers'),
  maxPlayers: z.number().int().max(10).default(10),
});

export type CodebreakersConfig = z.infer<typeof CodebreakersConfigSchema>;
