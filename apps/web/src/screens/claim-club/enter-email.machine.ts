import { ActorRefFrom, ContextFrom, EventFrom } from 'xstate';
import { supabaseClient } from '../../lib/supabase';
import { createFormModelAndMachine } from '../../state/form.machine';

const { formModel, formMachine } = createFormModelAndMachine<{
  email: string;
}>(
  {
    email: '',
  },
  {
    handleSubmit: async ({ email }) => {
      const { error } = await supabaseClient.auth.updateUser({
        email,
      });

      if (error) {
        throw error;
      }

      return true;
    },
  }
);

export { formMachine as enterEmailMachine };
export const EnterEmailFormEvents = formModel.events;
export type EnterEmailFormContext = ContextFrom<typeof formModel>;
export type EnterEmailFormEvent = EventFrom<typeof formModel>;
export type EnterEmailActor = ActorRefFrom<typeof formMachine>;
