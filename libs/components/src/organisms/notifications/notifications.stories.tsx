import { useEffect } from '@storybook/addons';
import { ComponentStory, Meta } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { NotificationsComponent } from './notifications.component';
import { notificationsMachine } from './notifications.machine';

export default { component: NotificationsComponent } as Meta;

export const Success: ComponentStory<typeof NotificationsComponent> = (
  args
) => {
  const actor = useInterpret(notificationsMachine);

  useEffect(() => {
    setTimeout(() => {
      actor.send({ type: 'SHOW', options: { type: 'success' } });
    }, 200);
  }, [actor]);

  return <NotificationsComponent actor={actor} />;
};
