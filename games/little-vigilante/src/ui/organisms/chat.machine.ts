import {
  JoinCommand,
  DisconnectCommand,
  ReconnectCommand,
  LeaveCommand,
  LittleVigilanteServerEvent,
  MessageCommand,
  PauseCommand,
  ResumeCommand,
  ServerEvent,
  LittleVigilanteTargetPlayerRoleCommand,
} from '@explorers-club/room';
import { assign } from '@xstate/immer';
import { ComponentProps } from 'react';
import { Observable } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { GameAvatar } from '../molecules/game-avatar.component';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { RoleAvatar } from '../molecules/role-avatar.component';

// type RoleAvatarProps = {
//   type: 'role';
// } & ComponentProps<typeof RoleAvatar>;

// type GameAvatarProps = {
//   type: 'game';
// } & ComponentProps<typeof GameAvatar>;

// type PlayerAvatarProps = {
//   type: 'game';
// } & ComponentProps<typeof PlayerAvatar>;

// type AvatarProps = RoleAvatarProps | GameAvatarProps | PlayerAvatarProps;

// type WithAvatar<T> = T & {
//   avatar: AvatarProps;
// };

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
    type: "parallel",
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
          TARGET_ROLE: {
            actions: assign<ChatContext, ServerEvent<LittleVigilanteTargetPlayerRoleCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
          LEAVE: {
            actions: assign<ChatContext, ServerEvent<LeaveCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
          RECONNECT: {
            actions: assign<ChatContext, ServerEvent<ReconnectCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
          DISCONNECT: {
            actions: assign<ChatContext, ServerEvent<DisconnectCommand>>(
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
          RESUME: {
            actions: assign<ChatContext, ServerEvent<ResumeCommand>>(
              (context, event) => {
                context.events.push(event);
              }
            ),
          },
          PAUSE: {
            actions: assign<ChatContext, ServerEvent<PauseCommand>>(
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
