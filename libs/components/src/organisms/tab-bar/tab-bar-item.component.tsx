import * as Tabs from '@radix-ui/react-tabs';
import { useSelector } from '@xstate/react';
import { FC, useCallback } from 'react';
import { AnyActorRef } from 'xstate';
import { Button } from '../../atoms/Button';
import { TabMetadata, TabName } from './tab-bar.types';

interface Props {
  actor: AnyActorRef;
  name: TabName;
}

export const TabBarItem: FC<Props> = ({ actor, name }) => {
  const isVisible = useSelector(actor, (state) => state.matches('Tab.Visible'));
  const meta = useSelector(
    actor,
    (state) =>
      Object.assign({}, ...Object.values(state.meta)) as Partial<TabMetadata>
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Tabs.Trigger value={name}>
      {meta.icon ? meta.icon : meta.displayName}
    </Tabs.Trigger>
  );
};
