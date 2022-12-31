import { ReactNode } from 'react';
import { ActorRefFrom, assign, createMachine, spawn, StateFrom } from 'xstate';
import { TabBarItemActor, tabBarItemMachine } from './tab-bar-item.machine';
import { TabName } from './tab-bar.types';

interface TabBarContext {
  tabs: Partial<Record<TabName, TabBarItemActor>>;
  currentTab: TabName;
}

type TabBarEvent = {
  type: 'OPEN';
  tab: TabName;
};

type TabComponents = Record<TabName, ReactNode>;

export const createTabBarMachine = (
  components: TabComponents,
  initialTabs: TabName[]
) =>
  createMachine(
    {
      id: 'TabBarMachine',
      initial: 'Idle',
      schema: {
        context: {} as TabBarContext,
        events: {} as TabBarEvent,
      },
      context: {
        currentTab: initialTabs[0],
        tabs: (() => {
          const tabs: Partial<Record<TabName, TabBarItemActor>> = {};
          initialTabs.forEach((tab) => {
            const component = components[tab];
            tabs[tab] = spawn(
              tabBarItemMachine.withContext({ component, tab })
            );
          });
          return tabs;
        })(),
      },
      states: {
        Idle: {
          on: {
            OPEN: {
              actions: ['setCurrentTab', 'spawnCurrentTab'],
            },
          },
        },
      },
    },
    {
      actions: {
        setCurrentTab: assign<TabBarContext, TabBarEvent>({
          currentTab: (_, event) => event.tab,
        }),
        spawnCurrentTab: assign<TabBarContext, TabBarEvent>({
          tabs: ({ tabs, currentTab }) => {
            if (!tabs[currentTab]) {
              const component = components[currentTab];
              return {
                ...tabs,
                [currentTab]: spawn(
                  tabBarItemMachine.withContext({ component })
                ),
              };
            }
            return tabs;
          },
        }),
      },
    }
  );

export type TabBarMachine = ReturnType<typeof createTabBarMachine>;
export type TabBarActor = ActorRefFrom<TabBarMachine>;
export type TabBarState = StateFrom<TabBarMachine>;
