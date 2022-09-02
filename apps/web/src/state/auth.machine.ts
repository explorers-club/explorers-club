import { User } from '@supabase/supabase-js';
import {
  assign,
  ContextFrom,
  EventFrom,
  ActorRefFrom,
  StateFrom,
  DoneInvokeEvent,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../lib/supabase';

const authModel = createModel(
  {
    user: null as User | null,
  },
  {
    events: {
      LOGOUT: () => ({}),
      CREATE_ANONYMOUS_USER: (alias: string) => ({ alias }),
    },
  }
);

export type AuthContext = ContextFrom<typeof authModel>;
export type AuthEvent = EventFrom<typeof authModel>;

const authMachine = authModel.createMachine(
  {
    id: 'AuthMachine',
    initial: 'Initializing',
    context: authModel.initialContext,
    states: {
      Initializing: {
        invoke: {
          src: 'initialize',
          onDone: [
            {
              actions: assign({
                user: (_, event: DoneInvokeEvent<User | null>) => event.data,
              }),
            },
            {
              target: 'Authenticated',
              cond: 'isLoggedIn',
            },
            {
              target: 'Unauthenticated',
            },
          ],
        },
      },
      Unauthenticated: {
        states: {
          Idle: {
            on: {
              CREATE_ANONYMOUS_USER: 'Loading',
            },
          },
          Loading: {
            invoke: {
              src: 'createAnonymousUser',
              onDone: {
                actions: assign({
                  user: (_, event) => event.data,
                }),
                target: 'Success',
              },
              onError: 'Error',
            },
          },
          Success: {
            type: 'final' as const,
          },
          Error: {},
        },
        onDone: 'Authenticated',
      },
      Authenticated: {
        on: {
          LOGOUT: {
            actions: 'logout',
            target: 'Unauthenticated',
          },
        },
      },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      logout: async () => {
        await supabaseClient.auth.signOut();
      },
    },
    guards: {
      isLoggedIn: (context) => !!context.user,
    },
    services: {
      initialize: async (context, event) => {
        const response = await supabaseClient.auth.getSession();
        return response.data.session?.user;
      },
      createAnonymousUser: async (context, event) => {
        const id = crypto.randomUUID();
        const password = crypto.randomUUID();

        const response = await supabaseClient.auth.signUp({
          email: `${id}@anon-users.explorers.club`,
          password,
        });
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data.user;
      },
    },
  }
);

export type AuthActor = ActorRefFrom<typeof authMachine>;
export type AuthState = StateFrom<typeof authMachine>;

export const createAuthMachine = (context: AuthContext) =>
  authMachine.withContext(context);
