import { ActorManager, ActorType, getActorId } from '@explorers-club/actor';
import { matchPath, NavigateFunction } from 'react-router-dom';
import { ActorRefFrom, ContextFrom, DoneInvokeEvent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createClaimClubScreenMachine } from '../screens/claim-club/claim-club-screen.machine';
import { createClubScreenMachine } from '../screens/club/club-screen.machine';
import { createHomeScreenMachine } from '../screens/home/home-screen.machine';
import { AuthActor } from './auth.machine';

const navigationModel = createModel(
  {},
  { events: { NAVIGATE_CLAIM_CLUB: (playerName: string) => ({ playerName }) } }
);

export type NavigationContext = ContextFrom<typeof navigationModel>;

export const NavigationEvents = navigationModel.events;

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
            src: () => createHomeScreenMachine(),
          },
          on: {
            NAVIGATE_CLAIM_CLUB: {
              target: 'ClaimClub',
              actions: 'navigateToClaimClub',
            },
          },
        },
        ClaimClub: {
          invoke: {
            id: 'claimClubScreenMachine',
            src: (_) => {
              const pathMatch = matchPath(
                '/:playerName/claim',
                window.location.pathname
              );

              const playerName = pathMatch?.params.playerName;
              if (!playerName) {
                throw new Error(
                  'expected playerName from path but was undefined'
                );
              }

              return createClaimClubScreenMachine({
                playerName,
                authActor,
              });
            },
            onDone: {
              target: 'Club',
              actions: (
                _,
                {
                  data: { playerName },
                }: DoneInvokeEvent<{ playerName: string }>
              ) => {
                navigate(`/${playerName}`, { replace: true });
              },
            },
          },
        },
        Club: {
          invoke: {
            id: 'clubScreenMachine',
            src: (_) => {
              const pathMatch = matchPath(
                '/:playerName',
                window.location.pathname
              );
              const playerName = pathMatch?.params.playerName;
              if (!playerName) {
                throw new Error(
                  'expected playerName from path but was undefined'
                );
              }
              const actorId = getActorId(ActorType.PARTY_ACTOR, playerName);
              const actorManager = new ActorManager(actorId);

              return createClubScreenMachine({
                hostPlayerName: playerName,
                authActor,
                actorManager,
              });
            },
          },
          on: {
            NAVIGATE_CLAIM_CLUB: {
              target: 'ClaimClub',
              actions: 'navigateToClaimClub',
            },
          },
        },
      },
      predictableActionArguments: true, // from xstate v4 warning
    },
    {
      actions: {
        navigateToClaimClub: (_, { playerName }) => {
          console.log({ playerName });
          navigate(`/${playerName}/claim`, { replace: true });
        },
        // navigateToClubScreen: (context, event: DoneInvokeEvent<string>) => {
        //   const playerName = event.data;
        //   if (!playerName) {
        //     throw new Error('expected club screen');
        //   }
        //   navigate(`/${playerName}`, { replace: true });
        // },
      },
    }
  );
};

export type NavigationMachine = ReturnType<typeof createNavigationMachine>;
export type NavigationActor = ActorRefFrom<NavigationMachine>;
export type NavigationState = StateFrom<NavigationMachine>;
