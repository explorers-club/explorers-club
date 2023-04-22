// CommonTypes.ts
import { StateValue } from 'xstate';
import { z } from 'zod';

export const SnowflakeIdSchema = z.string();

export const StateValueSchema: z.ZodType<StateValue> = z.union([
  z.string(),
  z.record(z.lazy(() => StateValueSchema)),
]);

// Define the base Event type with a "type" string parameter
export const EventBaseSchema = z.object({
  type: z.string(),
});
export type EventBase = z.infer<typeof EventBaseSchema>;
