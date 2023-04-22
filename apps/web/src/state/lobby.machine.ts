import { createMachine, StateFrom } from 'xstate';
import { z } from 'zod';
import { StartRoomEventSchema } from '../events';

export const LobbyContextSchema = z.object({
  userId: z.string(),
});
export type LobbyContext = z.infer<typeof LobbyContextSchema>;

export const LobbyEventSchema = z.union([
  z.object({
    type: z.literal('JOIN_ROOM'),
    userId: z.string(),
  }),
  StartRoomEventSchema,
]);
export type LobbyEvent = z.infer<typeof LobbyEventSchema>;

export const lobbyMachine = createMachine({
  id: 'LobbyMachine',
  initial: 'Idle',
  type: 'parallel',
  schema: {
    context: {} as LobbyContext,
    events: {} as LobbyEvent,
  },
  states: {
    Idle: {},
  },
});
export type LobbyMachine = typeof lobbyMachine;
export type LobbyState = StateFrom<LobbyMachine>;
