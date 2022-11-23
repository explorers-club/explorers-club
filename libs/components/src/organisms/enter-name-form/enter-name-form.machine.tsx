import { ActorRefFrom, ContextFrom, EventFrom } from 'xstate';
import { createFormModelAndMachine } from '../../state/form.machine';

const { formModel, formMachine } = createFormModelAndMachine<{
  name: string;
}>(
  {
    name: '',
  },
  {
    handleSubmit: async ({ name }) => {
      // Do async validation here?
      return true;
    },
  }
);

export { formMachine as enterNameMachine };
export const EnterNameFormEvents = formModel.events;
export type EnterNameFormContext = ContextFrom<typeof formModel>;
export type EnterNameFormEvent = EventFrom<typeof formModel>;
export type EnterNameActor = ActorRefFrom<typeof formMachine>;
