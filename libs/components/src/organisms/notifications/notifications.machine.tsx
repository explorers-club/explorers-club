import { ActorRefFrom, assign, createMachine, spawn, StateFrom } from 'xstate';
import { NotificationOptions } from './notfications.types';
import {
  createNotificationItemMachine,
  NotificationItemActor,
} from './notification-item.machine';

export interface NotificationsContext {
  notifications: NotificationItemActor[];
}

export type NotificationsEvent = { type: 'SHOW'; options: NotificationOptions };

export const notificationsMachine = createMachine({
  id: 'NotificationsMachine',
  initial: 'Idle',
  context: {
    notifications: [],
  },
  schema: {
    context: {} as NotificationsContext,
    events: {} as NotificationsEvent,
  },
  states: {
    Idle: {
      on: {
        SHOW: {
          actions: assign<NotificationsContext, NotificationsEvent>({
            notifications: ({ notifications }, { options }) => [
              ...notifications,
              spawn(createNotificationItemMachine(options)),
            ],
          }),
        },
      },
    },
  },
});

export type NotificationsMachine = typeof notificationsMachine;
export type NotificationsActor = ActorRefFrom<NotificationsMachine>;
export type NotificationsState = StateFrom<NotificationsMachine>;
