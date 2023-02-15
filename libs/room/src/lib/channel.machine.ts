import { ChannelId, Message } from '@explorers-club/chat';
import { Observable } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { MessageCommand, RoomServerEvent, ServerEvent } from '../types';

export interface ChannelContext {
  channelId: ChannelId;
  messages: Message[];
  cursor?: string;
}

export const createChannelMachine = (
  channelId: ChannelId,
  event$: Observable<RoomServerEvent>
) => {
  return createMachine({
    id: 'ChannelMachine',
    initial: 'Running',
    schema: {
      context: {} as ChannelContext,
      events: {} as RoomServerEvent,
    },
    context: {
      channelId,
      messages: [],
    },
    states: {
      Running: {
        invoke: {
          src: () => event$,
        },
        on: {
          MESSAGE: {
            // actions: assign<ChannelContext, ServerEvent<MessageCommand>>({
            //   messages: (context, event) => {
            //     return [...context.messages, event];
            //   },
            // }),
          },
        },
      },
    },
  });
};

export type ChannelMachine = ReturnType<typeof createChannelMachine>;
export type ChannelState = StateFrom<ChannelMachine>;
export type ChannelActor = ActorRefFrom<ChannelMachine>;
