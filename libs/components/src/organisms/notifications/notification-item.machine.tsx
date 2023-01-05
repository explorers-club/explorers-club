import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { NotificationOptions } from './notifications.types';

export interface NotificationItemContext {
  options: NotificationOptions;
}

export const createNotificationItemMachine = (options: NotificationOptions) =>
  createMachine({
    id: 'NotificationItemMachine',
    initial: 'Idle',
    context: {
      options,
    },
    schema: {
      context: {} as NotificationItemContext,
    },
    states: {
      Idle: {},
    },
  });

export type NotificationItemMachine = ReturnType<
  typeof createNotificationItemMachine
>;
export type NotificationItemActor = ActorRefFrom<NotificationItemMachine>;
export type NotificationItemState = StateFrom<NotificationItemMachine>;
