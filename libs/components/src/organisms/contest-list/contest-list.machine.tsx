import { createModel } from 'xstate/lib/model';

interface Contest {
  startsAt: Date;
  gameId: string;
  props: unknown;
  startedAt?: Date;
  gameInstanceId?: string;
}

export type ContestListContext = {
  contests: Contest[];
};

const contestListModel = createModel(
  {
    contests: [],
  },
  {
    events: {
      REFRESH: () => ({}),
    },
  }
);

export const contestListMachine = contestListModel.createMachine({
  id: 'ContestListMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});
