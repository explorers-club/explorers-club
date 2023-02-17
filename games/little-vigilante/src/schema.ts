import { UserIdSchema } from '@explorers-club/chat';
import { z } from 'zod';

const RoundIdSchema = z.string().uuid();
const MatchIdSchema = z.string().uuid();

const TeamSchema = z.enum(['vigilantes', 'citizens', 'anarchists']);
export type Team = z.infer<typeof TeamSchema>;

export const RoleSchema = z.enum([
  'detective',
  'cop',
  'vigilante',
  'twin_girl',
  'twin_boy',
  'butler',
  'con_artist',
  'snitch',
  'sidekick',
  'monk',
  'mayor',
  'anarchist',
]);

export type Role = z.infer<typeof RoleSchema>;

const PointsSchema = z.number().min(0);

export const MatchResultSchema = z.object({
  roundsIds: z.array(RoundIdSchema),
  userIds: z.array(UserIdSchema),
});

export const RoundResultSchema = z.object({
  roundId: RoundIdSchema,
});

export const RoundPlayerResultSchema = z.object({
  matchId: MatchIdSchema,
  roundId: RoundIdSchema,
  roundNumber: z.number().min(0).max(999),
  userId: UserIdSchema,
  startRole: RoleSchema,
  endRole: RoleSchema,
  points: PointsSchema,
});
