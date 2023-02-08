import {
  JoinCommand,
  LeaveCommand,
  LittleVigilanteServerEvent,
  MessageCommand,
  ServerEvent,
} from '@explorers-club/room';
import { assign } from '@xstate/immer';
import { Observable } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

export interface ChatContext {
  events: LittleVigilanteServerEvent[];
  cursor?: string;
}

export const createChatMachine = (
  event$: Observable<LittleVigilanteServerEvent>
) => {
  return createMachine({
    id: 'ChatMachine',
    initial: 'Running',
    schema: {
      context: {} as ChatContext,
      events: {} as LittleVigilanteServerEvent,
    },
    context: {
      events: [] as LittleVigilanteServerEvent[],
    },
    states: {
      Running: {
        invoke: {
          src: (context, event) => event$,
        },
        on: {
          LEAVE: {
            actions: assign<ChatContext, ServerEvent<LeaveCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
          JOIN: {
            actions: assign<ChatContext, ServerEvent<JoinCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
          MESSAGE: {
            actions: assign<ChatContext, ServerEvent<MessageCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
        },
      },
    },
  });
};

export type ChatMachine = ReturnType<typeof createChatMachine>;
export type ChatState = StateFrom<ChatMachine>;
export type ChatActor = ActorRefFrom<ChatMachine>;
