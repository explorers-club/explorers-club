import { useActorLogger } from '@explorers-club/actor';
import { ComponentMeta } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { EnterNameForm } from './enter-name-form.component';
import { enterNameMachine } from './enter-name-form.machine';

export default {
  component: EnterNameForm,
} as ComponentMeta<typeof EnterNameForm>;

export const Primary = () => {
  const formActor = useInterpret(enterNameMachine);
  useActorLogger(formActor); // TODO build an addon for logging xstate events from an actor
  // open source it on explorers club
  return <EnterNameForm formActor={formActor} />;
};
