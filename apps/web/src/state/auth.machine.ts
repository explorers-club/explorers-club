import { Session, User } from '@supabase/supabase-js';
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
    session: null as Session | null,
  },
  {
    events: {
      LOGOUT: () => ({}),
      CREATE_ANONYMOUS_USER: () => ({}),
    },
  }
);

export const AuthEvents = authModel.events;

export type AuthContext = ContextFrom<typeof authModel>;
export type AuthEvent = EventFrom<typeof authModel>;

export const createAuthMachine = () =>
  authModel.createMachine(
    {
      id: 'AuthMachine',
      initial: 'Initializing',
      context: authModel.initialContext,
      states: {
        Initializing: {
          initial: 'Fetching',
          states: {
            Fetching: {
              invoke: {
                src: 'getSession',
                onDone: [
                  {
                    target: 'Complete',
                    actions: assign({
                      session: (_, { data }: DoneInvokeEvent<Session | null>) =>
                        data,
                    }),
                  },
                ],
              },
            },
            Complete: {
              type: 'final' as const,
            },
            Error: {},
          },
          onDone: [
            {
              target: 'Authenticated',
              cond: 'isLoggedIn',
            },
            {
              target: 'Unauthenticated',
            },
          ],
        },
        Unauthenticated: {
          initial: 'Idle',
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
                    session: (_, event: DoneInvokeEvent<Session | null>) =>
                      event.data,
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
        isLoggedIn: (context, event) => {
          return !!context.session;
        },
      },
      services: {
        getSession: async () => {
          return await (
            await supabaseClient.auth.getSession()
          ).data.session;
        },
        createAnonymousUser: async () => {
          const id = crypto.randomUUID();
          const password = crypto.randomUUID();

          const response = await supabaseClient.auth.signUp({
            email: `${id}@anon-users.explorers.club`,
            password,
          });
          if (response.error) {
            throw new Error(response.error.message);
          }
          if (!response.data.session) {
            throw new Error('unknown error creating user');
          }
          return response.data.session;
        },
      },
    }
  );

export type AuthMachine = ReturnType<typeof createAuthMachine>;
export type AuthActor = ActorRefFrom<AuthMachine>;
export type AuthState = StateFrom<AuthMachine>;
