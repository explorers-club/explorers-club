import { NavigateFunction } from 'react-router-dom';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { ActorRefFrom, ContextFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { homeMachine } from '../routes/home/home.machine';
import { playerSetupMachine } from '../routes/player-setup/player-setup.machine';
import { Route } from '../routes/routes.constants';
import { AuthActor } from './auth.machine';
import { PartyActor } from './party.machine';

const navigationModel = createModel(
  {
    currentRoute: {} as Route,
    partyActor: {} as PartyActor,
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
            onDone: [
              {
                target: 'PlayerSetup',
                cond: 'requiresPlayerSetup',
              },
              {
                target: 'Party',
                cond: 'isPartyInitialized',
              },
              {
                target: 'NewParty',
              },
            ],
          },
        },
        PlayerSetup: {
          entry: 'navigateToPlayerSetup',
          invoke: {
            src: 'playerSetupMachine',
            onDone: [
              {
                target: 'Party',
                cond: 'isPartyInitialized',
              },
              {
                target: 'NewParty',
              },
            ],
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
        navigateToParty: (context) =>
          context.navigate(
            `/player/${context.partyActor.getSnapshot()?.context.code}`
          ),
      },
      guards: {
        requiresPlayerSetup: (context) =>
          !context.authActor.getSnapshot()?.context.user, // TODO use state.matches
        isPartyInitialized: (context) =>
          !!context.partyActor.getSnapshot()?.context.code,
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
