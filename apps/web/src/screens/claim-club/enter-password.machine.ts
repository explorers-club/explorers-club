import { ActorRefFrom, ContextFrom, EventFrom } from 'xstate';
import { supabaseClient } from '../../lib/supabase';
import { createFormModelAndMachine } from '../../../../../libs/components/src/state/form.machine';

const { formModel, formMachine } = createFormModelAndMachine<{
  password: string;
}>(
  {
    password: '',
  },
  {
    handleSubmit: async ({ password }) => {
      const { error } = await supabaseClient.auth.updateUser({
        password,
        data: {
          has_password: true,
        },
      });

      if (error) {
        throw error;
      }

      return true;
    },
  }
);

export { formMachine as enterPasswordMachine };
export const EnterPasswordFormEvents = formModel.events;
export type EnterPasswordFormContext = ContextFrom<typeof formModel>;
export type EnterPasswordFormEvent = EventFrom<typeof formModel>;
export type EnterPasswordActor = ActorRefFrom<typeof formMachine>;
