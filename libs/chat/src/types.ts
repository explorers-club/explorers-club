import { z } from 'zod';
import {
  ChannelIdSchema,
  ConversationIdSchema,
  ConversationSchema,
  MessageSchema,
} from './schema';

export type Message = z.infer<typeof MessageSchema>;

// You have private channels
export type ChannelId = z.infer<typeof ChannelIdSchema>;

export type ConversationId = z.infer<typeof ConversationIdSchema>;

export type Conversation = z.infer<typeof ConversationSchema>;

// Schemas
// todo pull game specific types out out of common types
const RoleSchema = z.enum([
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

export const NightPhaseBeginMessageSchema = z.literal('night_phase');
export const RoleAssignMessageSchema = z
  .object({
    K: z.literal('role_assign'),
    P: z.object({
      role: RoleSchema,
    }),
  })
  .required();
export const DiscussMessageSchema = z.literal('discuss');
export const VoteMessageSchema = z.literal('vote');
export const YouWonMessageSchema = z.literal('you_won');
export const YouLostMessageSchema = z.literal('you_lost');
export const SidekickAbilityMessageSchema = z
  .object({
    K: z.literal('sidekick_ability'),
    P: z.object({
      vigilanteUserId: z.string(),
      vigilantePlayerName: z.string(),
      vigilanteSlotNumber: z.number(),
    }),
  })
  .required();
export const VigilanteAbilityPrimaryMessageSchema = z
  .object({
    K: z.literal('vigilante_ability_primary'),
    P: z.object({
      sidekickUserId: z.string(),
      sidekickPlayerName: z.string(),
      sidekickSlotNumber: z.number(),
    }),
  })
  .required();
export const VigilanteAbilityFallbackMessageSchema = z
  .object({
    K: z.literal('vigilante_ability_fallback'),
    P: z.object({
      unusedRole: z.string(),
    }),
  })
  .required();
export const WinnersMessageSchema = z
  .object({
    K: z.literal('winners'),
    P: z.object({
      vigilantePlayerName: z.string(),
      vigilanteSlotNumber: z.number(),
      sidekickPlayerName: z.string().optional(),
      sidekickSlotNumber: z.number().optional(),
    }),
  })
  .required();

// Types
export type NightPhaseBeginsMessage = z.infer<
  typeof NightPhaseBeginMessageSchema
>;
export type RoleAssignMessage = z.infer<typeof RoleAssignMessageSchema>;
export type DiscussMessage = z.infer<typeof DiscussMessageSchema>;
export type VoteMessage = z.infer<typeof VoteMessageSchema>;
export type WinnersMessage = z.infer<typeof WinnersMessageSchema>;
export type YouWonMessage = z.infer<typeof YouWonMessageSchema>;
export type YouLostMessage = z.infer<typeof YouLostMessageSchema>;
export type SidekickAbilityMessage = z.infer<
  typeof SidekickAbilityMessageSchema
>;
export type VigilanteAbilityPrimaryMessage = z.infer<
  typeof VigilanteAbilityPrimaryMessageSchema
>;
export type VigilanteAbilityFallbackMessage = z.infer<
  typeof VigilanteAbilityFallbackMessageSchema
>;
