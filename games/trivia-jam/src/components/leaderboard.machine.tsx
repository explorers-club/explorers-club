import { createMachine } from 'xstate';
import {
  LeaderboardEvent,
  LeaderboardContext,
  LeaderboardServices,
} from './leaderboard.types';

export const leaderboardMachine = createMachine({
  id: 'LeaderboardMachine',
  schema: {
    context: {} as LeaderboardContext,
    events: {} as LeaderboardEvent,
    services: {} as LeaderboardServices,
  },
  initial: 'Loading',
  states: {
    Loading: {
      invoke: {
        src: 'loadLeaderboard',
        onDone: {
          target: 'Loaded',
        },
      },
    },
    Loaded: {},
  },
});

leaderboardMachine.withConfig({
  services: leaderboardServices,
});
