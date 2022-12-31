import * as Tabs from '@radix-ui/react-tabs';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { TabBarItemActor } from './tab-bar-item.machine';

interface Props {
  actor: TabBarItemActor;
}

export const TabBarItemComponent: FC<Props> = ({ actor }) => {
  const tab = useSelector(actor, (state) => state.context.tab);

  return <Tabs.Trigger value={tab}>{tab}</Tabs.Trigger>;
};
