import { ClubMetadata } from '@explorers-club/schema';
import { TabMetadata } from '@organisms/tab-bar';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { Client, RoomAvailable } from 'colyseus.js';
import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';

export interface HomeTabContext {
  clubName: string;
  colyseusClient: Client;
}

export const homeTabMachine = createMachine({
  id: 'HomeTabMachine',
  type: 'parallel',
  schema: {
    context: {} as HomeTabContext,
  },
  states: {
    WelcomeCard: {
      initial: 'Initializing',
      states: {
        Initializing: {},
      },
    },
    Promotional: {
      initial: 'Initializing',
      states: {
        Initializing: {},
      },
    },
    LobbyCard: {
      initial: 'Initializing',
      states: {
        Initializing: {},
      },
    },
    GameCarouselCard: {
      initial: 'Initializing',
      states: {
        Initializing: {},
      },
    },
    GameScoreboardCard: {
      initial: 'Initializing',
      states: {
        Initializing: {},
      },
    },
    GameDetailsCard: {
      initial: 'Initializing',
      states: {
        Initializing: {},
      },
    },
  },
});

export type HomeTabMachine = typeof homeTabMachine;
export type HomeTabActor = ActorRefFrom<HomeTabMachine>;
export type HomeTabState = StateFrom<HomeTabMachine>;
