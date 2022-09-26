import { PartiesRow } from '@explorers-club/database';
import { RealtimeChannel } from '@supabase/supabase-js';
import { matchPath, NavigateFunction } from 'react-router-dom';
import { ActorRefFrom, ContextFrom, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { homeScreenMachine } from '../routes/home/home-screen.machine';
import { newPartyScreenMachine } from '../routes/new-party/new-party-screen.machine';
import { createPartyScreenMachine } from '../routes/party/party-screen.machine';
import { AuthActor } from './auth.machine';

const navigationModel = createModel({}, { events: { FOO: () => ({} as any) } }); // Fixes TS lol
export type NavigationContext = ContextFrom<typeof navigationModel>;

interface CreateNavigationMachineProps {
  initial: string;
  navigate: NavigateFunction;
  authActor: AuthActor;
}

export const createNavigationMachine = ({
  initial,
  navigate,
  authActor,
}: CreateNavigationMachineProps) => {
  return navigationModel.createMachine(
    {
      id: 'NavigationMachine',
      initial,
      states: {
        Home: {
          invoke: {
            id: 'homeScreenMachine',
            src: homeScreenMachine,
            onDone: [
              {
                target: 'Party',
                cond: (_, event: DoneInvokeEvent<PartiesRow | undefined>) =>
                  !!event.data,
                actions: ['navigateToPartyScreen'],
              },
              {
                target: 'NewParty',
                actions: 'navigateToNewPartyScreen',
              },
            ],
          },
        },
        NewParty: {
          invoke: {
            id: 'newPartyScreenMachine',
            src: newPartyScreenMachine,
            onDone: {
              target: 'Party',
              actions: ['navigateToPartyScreen'],
            },
          },
        },
        Party: {
          invoke: {
            id: 'partyScreenMachine',
            src: (_) => {
              const pathMatch = matchPath(
                '/party/:joinCode',
                window.location.pathname
              );
              const joinCode = pathMatch?.params.joinCode;
              if (!joinCode) {
                throw new Error('trying to join party without join code set');
              }

              return createPartyScreenMachine({ joinCode, authActor });
            },
          },
        },
      },
      predictableActionArguments: true, // from xstate v4 warning
    },
    {
      actions: {
        navigateToNewPartyScreen: () => {
          navigate(`/party/new`, { replace: true });
        },
        navigateToPartyScreen: (
          context,
          event: DoneInvokeEvent<PartiesRow>
        ) => {
          const code = event.data.join_code;
          if (!code) {
            throw new Error('no join code on party');
          }
          navigate(`/party/${code}`, { replace: true });
        },
      },
    }
  );
};

type NavigationMachine = ReturnType<typeof createNavigationMachine>;
export type NavigationActor = ActorRefFrom<NavigationMachine>;
