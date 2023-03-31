import { SnowflakeIdSchema } from '@explorers-club/schema';
import { createMachine } from 'xstate';
import { z } from 'zod';
import { LoginEventSchema } from '../events';

const AuthContextSchema = z.object({
  userId: SnowflakeIdSchema,
});
type AuthContext = z.infer<typeof AuthContextSchema>;

const AuthEventSchema = LoginEventSchema;
type AuthEvent = z.infer<typeof AuthEventSchema>;

const authMachine = createMachine(
  {
    id: 'AuthMachine',
    initial: 'Initializing',
    schema: {
      context: {} as AuthContext,
      events: {} as AuthEvent,
    },
    // schema: {
    //   {} as AuthContext,
    // },
    states: {
      Initializing: {},
      Anonymous: {},
      LoggedIn: {},
    },
  },
  {
    services: {
      getCredentialsFromLocalStore: async () => {
        return { id2: 'foo' };
      },
    },
  }
);

type AuthMachine = typeof authMachine;
