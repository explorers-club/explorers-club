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