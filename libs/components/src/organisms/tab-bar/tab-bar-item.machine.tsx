import { ReactNode } from 'react';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { TabName } from './tab-bar.types';

export type TabBarItemContext = {
  component: ReactNode;
  tab: TabName;
};

export type TabBarItemEvent = {
  type: 'FOO';
};

export const tabBarItemMachine = createMachine({
  id: 'TabBarItemMachine',
  initial: 'Loading',
  schema: {
    context: {} as TabBarItemContext,
    events: {} as TabBarItemEvent,
  },
  states: {
    Loading: {},
  },
});

export type TabBarItemMachine = typeof tabBarItemMachine;
export type TabBarItemActor = ActorRefFrom<TabBarItemMachine>;
export type TabBarItemState = StateFrom<TabBarItemMachine>;
