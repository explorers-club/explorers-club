import { ReactNode } from 'react';
import {
  ActorRefFrom,
  AnyActorRef,
  assign,
  createMachine,
  StateFrom,
} from 'xstate';
import { TabName } from './tab-bar.types';

type TabConfig = Record<
  TabName,
  {
    name: TabName;
    actor: AnyActorRef;
    Component: ReactNode;
  }
>;

type TabBarContext = {
  tabs: Partial<TabConfig>;
  current: TabName;
};

type TabBarEvent = {
  type: 'NAVIGATE';
  tab: TabName;
};

export const createTabBarMachine = (tabs: Partial<TabConfig>) => {
  // get the first visual tab to determine
  let initialTab: TabName | undefined;
  Object.entries(tabs).forEach(([, { name, actor }]) => {
    if (!initialTab && actor.getSnapshot().matches('Tab.Visible')) {
      initialTab = name;
    }
  });

  if (!initialTab) {
    console.warn("warning couldn't find inital tab, default to Lobby");
    initialTab = 'Lobby';
  }

  return createMachine(
    {
      id: 'TabBarMachine',
      initial: 'Idle',
      schema: {
        context: {} as TabBarContext,
        events: {} as TabBarEvent,
      },
      context: {
        tabs,
        current: initialTab,
      },
      states: {
        Idle: {
          on: {
            NAVIGATE: {
              actions: 'setCurrentTab',
            },
          },
        },
      },
    },
    {
      actions: {
        setCurrentTab: assign<TabBarContext, TabBarEvent>({
          current: (_, event) => event.tab,
        }),
      },
    }
  );
};

export type TabBarMachine = ReturnType<typeof createTabBarMachine>;
export type TabBarActor = ActorRefFrom<TabBarMachine>;
export type TabBarState = StateFrom<TabBarMachine>;
