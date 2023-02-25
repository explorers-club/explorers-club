import { assign } from '@xstate/immer';
import { useInterpret } from '@xstate/react';
import { useState } from 'react';
import { ActorRefFrom, createMachine } from 'xstate';
import { z } from 'zod';
import { Role, RoleSchema } from '../../../schema';

export interface PlayerBoardContext {
  active: string[];
  selected: string[];
  revealedRoles: Partial<Record<string, Role>>;
}

const ClearEventSchema = z.object({
  type: z.literal('CLEAR'),
  key: z.string().optional(),
});
type ClearEvent = z.infer<typeof ClearEventSchema>;
const ClearSelectedEventSchema = z.object({
  type: z.literal('CLEAR_SELECTED'),
  key: z.string().optional(),
});
type ClearSelectedEvent = z.infer<typeof ClearSelectedEventSchema>;

const DisableEventSchema = z.object({
  type: z.literal('DISABLE'),
});
type DisableEvent = z.infer<typeof DisableEventSchema>;

const PressEventSchema = z
  .object({
    type: z.literal('PRESS'),
    key: z.string(),
  })
  .required();
type PressEvent = z.infer<typeof PressEventSchema>;

const ActivateEventSchema = z
  .object({
    type: z.literal('ACTIVATE'),
    keys: z.array(z.string()),
  })
  .required();
type ActivateEvent = z.infer<typeof ActivateEventSchema>;

const RevealEventSchema = z
  .object({
    type: z.literal('REVEAL'),
    key: z.string(),
    role: RoleSchema,
  })
  .required();
type RevealEvent = z.infer<typeof RevealEventSchema>;

const UnrevealEventSchema = z.object({
  type: z.literal('UNREVEAL'),
  key: z.string(),
  deactivate: z.boolean().optional(),
});
type UnrevealEvent = z.infer<typeof UnrevealEventSchema>;

export type PlayerBoardEvent =
  | ActivateEvent
  | PressEvent
  | ClearEvent
  | DisableEvent
  | ClearSelectedEvent
  | UnrevealEvent
  | RevealEvent;

interface PlayerBoardOptions {
  playerSelected?: () => void;
  initialize?: () => void;
  initialContext?: PlayerBoardContext;
}

const createPlayerBoardMachine = (options?: PlayerBoardOptions) => {
  return createMachine({
    id: 'PlayerBoard',
    context: options?.initialContext ?? {
      active: [],
      selected: [],
      revealedRoles: {},
    },
    schema: {
      context: {} as PlayerBoardContext,
      events: {} as PlayerBoardEvent,
    },
    type: 'parallel',
    on: {
      CLEAR: {
        actions: assign<PlayerBoardContext, ClearEvent>((context, { key }) => {
          if (key) {
            let index = context.active.indexOf(key);
            if (index >= 0) {
              context.active.splice(index, 1);
            }
            index = context.selected.indexOf(key);
            if (index >= 0) {
              context.selected.splice(index, 1);
            }
            delete context.revealedRoles[key];
          } else {
            context.active.length = 0;
            context.selected.length = 0;
            for (const key in context.revealedRoles) {
              delete context.revealedRoles[key];
            }
          }
        }),
      },
      CLEAR_SELECTED: {
        actions: assign<PlayerBoardContext, ClearSelectedEvent>((context) => {
          context.selected.length = 0;
        }),
      },
      DISABLE: {
        target: 'Disabled.True',
      },
      UNREVEAL: {
        actions: assign<PlayerBoardContext, UnrevealEvent>((context, event) => {
          delete context.revealedRoles[event.key];

          if (event.deactivate) {
            const keyIndex = context.active.indexOf(event.key);
            if (keyIndex >= 0) {
              context.active.splice(keyIndex, 1);
            }
          }
        }),
      },
      REVEAL: {
        target: 'Disabled.False',
        actions: assign<PlayerBoardContext, RevealEvent>((context, event) => {
          context.revealedRoles[event.key] = event.role;
          if (!context.active.includes(event.key)) {
            context.active.push(event.key);
          }
        }),
      },
      ACTIVATE: {
        target: 'Disabled.False',
        actions: assign<PlayerBoardContext, ActivateEvent>((context, event) => {
          context.active = event.keys;
        }),
      },
    },
    states: {
      Disabled: {
        initial: 'False',
        states: {
          False: {
            on: {
              PRESS: {
                actions: assign<PlayerBoardContext, PressEvent>(
                  (context, { key }) => {
                    const keyIndex = context.selected.indexOf(key);
                    if (keyIndex < 0) {
                      context.selected.push(key);
                    } else {
                      context.selected.splice(keyIndex, 1);
                    }
                  }
                ),
              },
            },
          },
          True: {},
        },
      },
    },
  });
};

type PlayerBoardMachine = ReturnType<typeof createPlayerBoardMachine>;
export type PlayerBoardActor = ActorRefFrom<PlayerBoardMachine>;

export const usePlayerBoard = (options?: PlayerBoardOptions) => {
  const [machine] = useState(createPlayerBoardMachine(options));
  return useInterpret(machine) as PlayerBoardActor;
};
