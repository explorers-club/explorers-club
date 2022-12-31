import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { Flex } from '../../atoms/Flex';
import { TabBarActor } from './tab-bar.machine';
import * as Tabs from '@radix-ui/react-tabs';
import { TabBarItemComponent } from './tab-bar-item.component';

interface Props {
  actor: TabBarActor;
}

export const TabBarComponent: FC<Props> = ({ actor }) => {
  const tabs = useSelector(actor, (state) => state.context.tabs);
  const currentTab = useSelector(actor, (state) => state.context.currentTab);

  return (
    <Tabs.Root defaultValue={currentTab}>
      <Tabs.List>
        {Object.entries(tabs).map(([tab, actor]) => (
          <TabBarItemComponent key={tab} actor={actor} />
        ))}
      </Tabs.List>
      {Object.entries(tabs).map(([tab, actorRef]) => {
        const Component = actorRef.getSnapshot()?.context.component;
        if (!Component) {
          console.warn('couldnt find component for ', tab);
          return null;
        }
        return (
          <Tabs.Content key={tab} value={tab}>
            {Component}
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
};
