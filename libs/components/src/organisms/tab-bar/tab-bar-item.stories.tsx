import * as Tabs from '@radix-ui/react-tabs';
import { ComponentStory, Meta } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import React from 'react';
import { TabBarItemComponent } from './tab-bar-item.component';
import { tabBarItemMachine } from './tab-bar-item.machine';

export default { component: TabBarItemComponent } as Meta;

const TestComponent = () => {
  return <div>Lobby</div>;
};

export const Primary: ComponentStory<typeof TabBarItemComponent> = (args) => {
  const actor = useInterpret(
    tabBarItemMachine.withContext({
      component: <TestComponent />,
      tab: 'Lobby',
    })
  );
  return (
    <Tabs.Root>
      <Tabs.List>
        <TabBarItemComponent actor={actor} />
      </Tabs.List>
    </Tabs.Root>
  );
};
