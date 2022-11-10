import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { assertEventType } from './utils';

export function createFormModel<T>(defaultValues: T) {
  return createModel(
    {
      values: defaultValues as T,
      errors: {} as Record<keyof T, string | undefined>,
      errorMessage: undefined as string | undefined,
    },
    {
      events: {
        CHANGE: (values: Partial<T>) => ({ values }),
        SUBMIT: () => ({}),
      },
    }
  );
}

interface FormServices<TValues> {
  handleSubmit: (values: TValues) => Promise<boolean>;
}

export function createFormModelAndMachine<T>(
  defaultValues: T,
  { handleSubmit }: FormServices<T>
) {
  const formModel = createModel(
    {
      values: defaultValues as T,
      errors: {} as Record<keyof T, string | undefined>,
      errorMessage: undefined as string | undefined,
    },
    {
      events: {
        CHANGE: (values: Partial<T>) => ({ values }),
        SUBMIT: () => ({}),
      },
    }
  );

  const formMachine = formModel.createMachine(
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
              ...event.values,
            };
          },
        }),
        clearError: formModel.assign({
          errorMessage: () => undefined,
        }),
      },
      services: {
        onSubmit: (context, event) => handleSubmit(context.values),
      },
    }
  );
  return { formMachine, formModel };
}
