import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { assertEventType } from './utils';

type FormValueTypes = string | number | boolean | undefined;

type FormValues = Record<string, FormValueTypes>;

const formModel = createModel(
  {
    values: {} as FormValues,
    errorMessage: undefined as string | undefined,
    // errors: {} as Record<string, string>, // not needed yet
  },
  {
    events: {
      CHANGE: (key: string, value: FormValueTypes) => ({ key, value }),
      SUBMIT: () => ({}),
    },
  }
);
export type FormContext = ContextFrom<typeof formModel>;
export type FormEvent = EventFrom<typeof formModel>;

interface FormServices<T> {
  handleSubmit: (context: FormContext, event: FormEvent) => Promise<T>;
}

export function createFormMachine<T>({ handleSubmit }: FormServices<T>) {
  return formModel.createMachine(
    {
      initial: 'Editing',
      context: formModel.initialContext,
      states: {
        Editing: {
          initial: 'Pristine',
          on: {
            CHANGE: {
              actions: 'assignValue',
            },
            SUBMIT: 'Submitting',
          },
          states: {
            Pristine: {},
            Error: {},
          },
        },
        Submitting: {
          invoke: {
            src: 'onSubmit',
            onDone: 'Success',
            onError: {
              target: 'Editing.Error',
              actions: 'assignError',
            },
          },
        },
        Success: {
          type: 'final' as const,
        },
      },
    },
    {
      actions: {
        assignError: formModel.assign({
          errorMessage: () => 'there was an error',
        }),
        assignValue: formModel.assign({
          values: (context, event) => {
            assertEventType(event, 'CHANGE');

            return {
              ...context.values,
              [event.key]: event.value,
            };
          },
        }),
        clearError: formModel.assign({
          errorMessage: () => undefined,
        }),
      },
      services: {
        onSubmit: (context, event) => handleSubmit(context, event),
      },
    }
  );
}
