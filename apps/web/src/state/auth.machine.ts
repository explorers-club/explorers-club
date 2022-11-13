import { ProfilesRow } from '@explorers-club/database';
import { Session } from '@supabase/supabase-js';
import { generateUUID } from '@explorers-club/utils';
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
    profile: null as ProfilesRow | null,
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
          initial: 'FetchSession',
          states: {
            FetchSession: {
              invoke: {
                src: 'getSession',
                onDone: [
                  {
                    // If we're logged in, fetch the profile next
                    target: 'FetchProfile',
                    cond: (context, event) => !!event.data,
                    actions: assign({
                      session: (_, { data }: DoneInvokeEvent<Session | null>) =>
                        data,
                    }),
                  },
                  {
                    target: 'Complete',
                  },
                ],
              },
            },
            FetchProfile: {
              invoke: {
                src: 'getProfile',
                onDone: {
                  target: 'Complete',
                  actions: assign({
                    profile: (
                      _,
                      { data }: DoneInvokeEvent<ProfilesRow | null>
                    ) => data,
                  }),
                },
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
        getProfile: async (context) => {
          const userId = context.session?.user.id;
          if (!userId) {
            throw new Error('tried to get profile without being logged in');
          }

          const { data, error } = await supabaseClient
            .from('profiles')
            .select()
            .eq('user_id', userId)
            .maybeSingle();

          if (error) {
            throw error;
          }
          return data;
        },
        createAnonymousUser: async () => {
          const id = generateUUID();
          const password = generateUUID();

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
