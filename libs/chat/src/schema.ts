import { z } from 'zod';

export const UserIdSchema = z.string();

export const ChannelIdSchema = z.string();

const LittleVigilanteChannelDataSchema = z.object({
  topic: z.string(),
  startedAt: z.date(),
});

const ClubChannelDataSchema = z.object({
  topic: z.string(),
});

export const ChannelSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('little_vigilante'),
    data: LittleVigilanteChannelDataSchema,
  }),
  z.object({ type: z.literal('club'), data: ClubChannelDataSchema }),
]);

export const ConversationNameSchema = z.string();

export const ConversationIdSchema = z.string();

export const ConversationSchema = z.object({
  id: ConversationIdSchema,
  name: ConversationNameSchema,
  isChannel: z.boolean(),
  isGroup: z.boolean(),
  isDM: z.boolean(),
  isArchived: z.boolean(),
  topic: z.object({
    setByUserId: UserIdSchema,
    value: z.string(),
  }),
  previousNames: z.array(ConversationNameSchema),
});

export const ConversationInfoResponseSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), data: ConversationSchema }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

export const MessageSchema = z
  .object({
    type: z.literal('MESSAGE'),
    userId: UserIdSchema,
    ts: z.number(),
    text: z.string(),
  })
  .required();
