import {
  ClientEvent,
  DisconnectCommand,
  JoinCommand,
  LeaveCommand,
  LittleVigilanteCallVoteCommand,
  LittleVigilanteMessageCommand,
  LittleVigilanteServerEvent,
  LittleVigilanteTargetPlayerRoleCommand,
  PauseCommand,
  ReconnectCommand,
  ResumeCommand,
  ServerEvent,
} from '@explorers-club/room';
import { assign } from '@xstate/immer';
import { Observable } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { Role } from '../../meta/little-vigilante.constants';

export type RoleAssignmentEvent = ClientEvent<{
  type: 'ROLE_ASSIGNMENT';
  role: Role;
}>;

type LittleVigilanteClientChatEvent = RoleAssignmentEvent;

export type LittleVigilanteChatEvent =
  | LittleVigilanteClientChatEvent
  | LittleVigilanteServerEvent;

export interface ChatContext {
  events: LittleVigilanteChatEvent[];
  cursor?: string;
}

export const createChatMachine = (
  event$: Observable<LittleVigilanteServerEvent>
) => {
  return createMachine({
    id: 'ChatMachine',
    initial: 'Running',
    type: 'parallel',
    schema: {
      context: {} as ChatContext,
      events: {} as LittleVigilanteChatEvent,
    },
    context: {
      events: [] as LittleVigilanteChatEvent[],
    },
    states: {
      Running: {
        invoke: {
          src: (context, event) => event$,
        },
        on: {
          // ROLE_ASSIGNMENT: {
          //   actions: assign<ChatContext, LittleVigilanteClientChatEvent>(
          //     (context, event) => {
          //       context.events.push(event);
          //     }
          //   ),
          // },
          TARGET_ROLE: {
            actions: assign<
              ChatContext,
              ServerEvent<LittleVigilanteTargetPlayerRoleCommand>
            >((context, event) => {
              context.events.push(event);
            }),
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
          CALL_VOTE: {
            actions: assign<
              ChatContext,
              ServerEvent<LittleVigilanteCallVoteCommand>
            >((context, event) => {
              context.events.push(event);
            }),
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
            actions: assign<
              ChatContext,
              ServerEvent<LittleVigilanteMessageCommand>
            >((context, event) => {
              context.events.push(event);
            }),
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

// chat: LittleVigilanteServerEvent[];
