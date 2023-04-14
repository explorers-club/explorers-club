import { z } from 'zod';

export const CloseNavEventSchema = z.object({
  type: z.literal('CLOSE_NAV'),
});

export const LoginEventSchema = z.object({
  type: z.literal('LOGIN'),
  email: z.string().email(),
});

export const CloseLoginEventSchema = z.object({
  type: z.literal('CLOSE_LOGIN'),
});

export const OpenLoginEventSchema = z.object({
  type: z.literal('OPEN_LOGIN'),
});

export const OpenNavEventSchema = z.object({
  type: z.literal('OPEN_NAV'),
});

export const OpenProfileEventSchema = z.object({
  type: z.literal('OPEN_PROFILE'),
});

export const JoinRoomEventSchema = z.object({
  type: z.literal('JOIN_ROOM'),
  name: z.string(),
});

export const LeaveRoomEventSchema = z.object({
  type: z.literal('LEAVE_ROOM'),
  name: z.string(),
});

export const SubmitNameEventSchema = z.object({
  type: z.literal('SUBMIT_NAME'),
  name: z.string(),
});

export const StartRoomEventSchema = z.object({
  type: z.literal('START_ROOM'),
});
