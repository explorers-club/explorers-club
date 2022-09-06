import { PartiesRow } from '@explorers-club/database';
import { ClientPartyActor, CLIENT_PARTY_EVENTS } from '@explorers-club/party';
import { NavigateFunction } from 'react-router-dom';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { ActorRefFrom, ContextFrom, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { homeMachine } from '../routes/home/home.machine';
import { playerSetupMachine } from '../routes/player-setup/player-setup.machine';
import { Route } from '../routes/routes.constants';
import { AuthActor } from './auth.machine';

const navigationModel = createModel(
  {
    currentRoute: {} as Route,
    partyActor: {} as ClientPartyActor,
    authActor: {} as AuthActor,
    navigate: {} as NavigateFunction,
    sheetRef: {} as React.RefObject<BottomSheetRef>,
  },
  {}
);
export type NavigationContext = ContextFrom<typeof navigationModel>;

export const createNavigationMachine = (context: NavigationContext) => {
  const navigationMachine = navigationModel.createMachine(
    {
      id: 'NavigationMachine',
      initial: context.currentRoute.state,
      context: navigationModel.initialContext,
      states: {
        Home: {
          entry: 'navigateToHome',
          invoke: {
            id: 'homeMachine',
            src: 'homeMachine',
            onDone: {
              target: 'Party',
              actions: (context, event: DoneInvokeEvent<PartiesRow>) => {
                if (!event.data.join_code) {
                  throw new Error('no join code on party');
                }
                context.partyActor.send(
                  CLIENT_PARTY_EVENTS.CONNECT(event.data.join_code)
                );
              },
            },
          },
        },
        NewParty: {
          entry: 'navigateToNewParty',
        },
        Party: {
          entry: 'navigateToParty',
        },
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        navigateToHome: (context) => context.navigate('/'),
        navigateToPlayerSetup: (context) => context.navigate('/player-setup'),
        navigateToNewParty: (context) => context.navigate('/player/new'),
        navigateToParty: (context) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { joinCode } = context.partyActor.getSnapshot()!.context;
          if (!joinCode) {
            throw new Error('tried to navigate to party without join code set');
          }

          context.navigate(`/party/${joinCode}`);
        },
      },
      guards: {
        requiresPlayerSetup: (context) =>
          !context.authActor.getSnapshot()?.context.user, // TODO use state.matches
      },
      services: {
        homeMachine,
        playerSetupMachine,
      },
    }
  );
  return navigationMachine.withContext(context);
};

type NavigationMachine = ReturnType<typeof createNavigationMachine>;
export type NavigationActor = ActorRefFrom<NavigationMachine>;
// export type NavigationState = StateFrom<NavigationMachine>;
