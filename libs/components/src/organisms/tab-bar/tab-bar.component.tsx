import * as Tabs from '@radix-ui/react-tabs';
import { useSelector } from '@xstate/react';
import { FC, useCallback } from 'react';
import { Flex } from '../../atoms/Flex';
import { TabBarItem } from './tab-bar-item.component';
import { TabBarActor } from './tab-bar.machine';
import { TabName } from './tab-bar.types';

interface Props {
  actor: TabBarActor;
}

export const TabBar: FC<Props> = ({ actor }) => {
  const tabs = useSelector(actor, (state) => state.context.tabs);
  const currentTab = useSelector(actor, (state) => state.context.current);

  // Handles navigations from Tabs.Trigger in children
  const handleChange = useCallback(
    (tab: string) => {
      actor.send({ type: 'NAVIGATE', tab: tab as TabName });
    },
    [actor]
  );

  return (
    <Tabs.Root value={currentTab} onValueChange={handleChange}>
      <Tabs.List>
        <Flex direction="rowReverse" gap="2" css={{ p: '$3' }}>
          {Object.entries(tabs).map(([tab, { actor }]) => {
            return <TabBarItem key={tab} actor={actor} name={tab as TabName} />;
          })}
        </Flex>
      </Tabs.List>
      {Object.entries(tabs).map(([tab, { Component }]) => {
        return (
          <Tabs.Content key={tab} value={tab}>
            {Component}
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
};
